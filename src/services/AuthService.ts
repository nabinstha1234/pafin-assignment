import { inject, injectable } from 'inversify';

import config from '../config';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { ITokenService } from '../interfaces/ITokenService';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IErrorService } from '../interfaces/services/IErrorService';
import { ILogger } from '../interfaces/ILogger';

import { ValidationError } from '../utils/ApiError';
import { ITokenPayload, IUserLogin, IUserLoginResponse } from '../interfaces/IUser';
import { IUserTokenService } from '../interfaces/services/IUserTokenServices';
import { IUserTokenDocument } from '../interfaces/IUserToke';
import { IDbTransactionRepository } from '../repository/DbTransactionRepository';

@injectable()
export default class AuthService implements IAuthService {
  private name = 'AuthService';
  private userRepository: IUserRepository;
  private logger: ILogger;
  private tokenService: ITokenService;
  private userTokenService: IUserTokenService;
  private errorService: IErrorService;
  private client: IDbTransactionRepository;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.TokenService) tokenService: ITokenService,
    @inject(TYPES.UserTokenService) userTokenService: IUserTokenService,
    @inject(TYPES.ErrorService) errorService: IErrorService,
    @inject(TYPES.DbTransaction) client: IDbTransactionRepository
  ) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.userTokenService = userTokenService;
    this.errorService = errorService;
    this.client = client;
  }

  login = async (args: IUserLogin): Promise<IUserLoginResponse> => {
    const operation = 'login';
    try {
      const email = args.email;
      const password = args.password;
      await this.client.begin();
      const user = await this.userRepository.getUserByEmail(email);

      if (!user) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.badCredentials],
          data: { email },
        });
      }

      const isPasswordCorrect = await this.userRepository.comparePassword(password, user.id);
      if (!isPasswordCorrect) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.badCredentials],
          data: { email },
        });
      }

      const payload: ITokenPayload = {
        _id: user.id,
      };

      const token = await this.tokenService.generateToken({
        payload,
        expiresAt: config.authTokenExpiration,
        secretKey: config.secretKey,
      });

      const refreshToken = await this.userTokenService.create({
        payload,
        expiresIn: config.refreshTokenExpiration,
        secretKey: config.refreshTokenKey,
        user: user.id,
        tokenType: config.tokenType.refresh,
      });
      await this.client.commit();
      return {
        _id: user.id,
        token,
        refreshToken: refreshToken.token,
      };
    } catch (err) {
      await this.client.rollback();
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  renewAccessToken = async (refreshToken: string): Promise<IUserLoginResponse> => {
    const operation = 'renewAccessToken';

    try {
      const tokenDoc: IUserTokenDocument | null = await this.userTokenService.getByToken(refreshToken);
      if (!tokenDoc) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.tokenInvalid],
          data: { refreshToken },
        });
      }

      const token = tokenDoc.token;

      const decoded: any = await this.tokenService
        .verifyToken({
          token,
          secretKey: config.refreshTokenKey,
        })
        .catch((err) =>
          this.logger.error({ operation: 'renewAccessToken', message: 'Invalid refresh token', data: { refreshToken } })
        );

      if (!decoded) {
        throw new ValidationError({
          message: config.translationKey.validationError,
          details: [config.translationKey.tokenInvalid],
          data: { refreshToken },
        });
      }

      const payload = {
        _id: decoded?._id,
        role: decoded?.role,
      };

      const newAccessToken = await this.tokenService.generateToken({
        payload: payload,
        expiresAt: config.authTokenExpiration,
        secretKey: config.secretKey,
      });

      return {
        token: newAccessToken,
        refreshToken,
        ...payload,
      };
    } catch (err) {
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };
}
