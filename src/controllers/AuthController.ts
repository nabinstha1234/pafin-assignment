import ms from 'ms';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { CookieOptions } from 'express';

import config from '../config';
import { TYPES } from '../types';
import { IAuthService } from '../interfaces/services/IAuthService';
import { IJoiService } from '../interfaces/services/IJoiService';
import { IUserService } from '../interfaces/services/IUserService';
import AuthValidation from '../validation/AuthValidation';

const translationKey = config.translationKey;

@injectable()
export default class AuthController {
  private name = 'AuthController';
  private authService: IAuthService;
  private joiService: IJoiService;

  constructor(
    @inject(TYPES.AuthService) authService: IAuthService,
    @inject(TYPES.JoiService) joiService: IJoiService,
    @inject(TYPES.UserService) userService: IUserService
  ) {
    this.authService = authService;
    this.joiService = joiService;
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'login';

    try {
      const args = req.body;
      const email = args.email;
      const password = args.password;

      const schema = AuthValidation.login();

      await this.joiService.validate({
        schema,
        input: {
          email,
          password,
        },
      });

      const loginResponse = await this.authService.login({
        email,
        password,
      });

      const options: CookieOptions = {
        maxAge: ms(config.refreshTokenExpiration),
        httpOnly: true,
      };

      res.cookie(config.refreshTokenCookieName, loginResponse.refreshToken, options);

      return res.status(200).send({
        message: res.__(translationKey.loginSuccess),
        data: loginResponse,
      });
    } catch (err) {
      next(err);
    }
  };
}
