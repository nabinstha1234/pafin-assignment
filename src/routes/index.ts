import express from 'express';

import appRouter from './app';
import userRouter from './user';

const app: express.Application = express();

app.use('/', appRouter);
app.use('/users', userRouter);

export default app;
