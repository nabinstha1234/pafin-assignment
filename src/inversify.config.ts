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

// Joi
import { IJoiService } from './interfaces/services/IJoiService';
import JoiService from './services/JoiService';

import { IUserRepository } from './interfaces/repository/IUserRepository';
import { IUserService } from './interfaces/services/IUserService';

// User
import UserRepository from './repository/UserRepository';
import UserService from './services/UserService';
import UserController from './controllers/UserController';

const container = new Container();

container.bind<IAppService>(TYPES.AppService).to(AppService);
container.bind<AppController>(TYPES.AppController).to(AppController);
// Logger
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger);

container.bind<IDataStoreRepository>(TYPES.DataStore).to(DataStoreRepository);
container.bind<IDbTransactionRepository>(TYPES.DbTransaction).to(DbTransactionRepository);

// Joi
container.bind<IJoiService>(TYPES.JoiService).to(JoiService);

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);
// Error
container.bind<IErrorService>(TYPES.ErrorService).to(ErrorService);
export default container;
