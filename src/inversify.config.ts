import 'reflect-metadata';
import { Container, interfaces } from 'inversify';

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

const container = new Container();

container.bind<IAppService>(TYPES.AppService).to(AppService);
container.bind<AppController>(TYPES.AppController).to(AppController);
// Logger
container.bind<ILogger>(TYPES.Logger).to(WinstonLogger);

// Error
container.bind<IErrorService>(TYPES.ErrorService).to(ErrorService);
export default container;
