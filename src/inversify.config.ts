import 'reflect-metadata';
import { Container } from 'inversify';

import { TYPES } from './types';
// Logger
import { ILogger } from './interfaces/ILogger';
import WinstonLogger from './utils/WinstonLogger';
// Error
import { IErrorService } from './interfaces/services/IErrorService';
import ErrorService from './services/ErrorService';

import { IAppService } from './interfaces/services/IAppService';
import AppService from './services/AppService';
import AppController from './controllers/AppController';

import { DataStoreRepository, IDataStoreRepository } from './repository/DataStoreRepository';
import { DbTransactionRepository, IDbTransactionRepository } from './repository/DbTransactionRepository';

// UserToken
import UserTokenService from './services/UserTokenService';
import UserTokenRepository from './repository/UserTokenRepository';
import UserTokenController from './controllers/TokenController';

import { IUserTokenRepository } from './interfaces/repository/IUserTokenRepository';
import { IUserTokenService } from './interfaces/services/IUserTokenServices';

// Joi
import { IJoiService } from './interfaces/services/IJoiService';
import JoiService from './services/JoiService';

import { IUserRepository } from './interfaces/repository/IUserRepository';
import { IUserService } from './interfaces/services/IUserService';

// JWT
import { ITokenService } from './interfaces/ITokenService';
import JWTService from './services/JWTService';

// User
import UserRepository from './repository/UserRepository';
import UserService from './services/UserService';
import UserController from './controllers/UserController';

// Auth
import { IAuthService } from './interfaces/services/IAuthService';
import AuthService from './services/AuthService';
import AuthController from './controllers/AuthController';

const container = new Container();

container.bind<IAppService>(TYPES.AppService).to(AppService);
container.bind<AppController>(TYPES.AppController).to(AppController);
// Logger
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger);

// Auth
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

container.bind<IDataStoreRepository>(TYPES.DataStore).to(DataStoreRepository);
container.bind<IDbTransactionRepository>(TYPES.DbTransaction).to(DbTransactionRepository);

// JWT
container.bind<ITokenService>(TYPES.TokenService).to(JWTService);

// Joi
container.bind<IJoiService>(TYPES.JoiService).to(JoiService);

// UserTokenRepository
container.bind<IUserTokenRepository>(TYPES.UserTokenRepository).to(UserTokenRepository);
container.bind<IUserTokenService>(TYPES.UserTokenService).to(UserTokenService);
container.bind<UserTokenController>(TYPES.UserTokenController).to(UserTokenController);
container.bind<UserController>(TYPES.UserController).to(UserController);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);

// Error
container.bind<IErrorService>(TYPES.ErrorService).to(ErrorService);
export default container;
