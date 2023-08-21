import 'reflect-metadata';
import express, { Application } from 'express';
import config from './config';

import loaders from './loaders';

const app: Application = express();

app.use(config.appVersion, express.static(`${__dirname}/../static`));
loaders({ app });

export default app;
