import express from 'express';

import appRouter from './app';
import userRouter from './user';
import authRouter from './auth';

const app: express.Application = express();

app.use('/', appRouter);
app.use('/users', userRouter);
app.use('/auth', authRouter);

export default app;
