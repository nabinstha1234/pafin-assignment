import { Router } from 'express';

import { TYPES } from '../types';
import container from '../inversify.config';
import AuthController from '../controllers/AuthController';

const authController: AuthController = container.get<AuthController>(TYPES.AuthController);
const router = Router();

router.post('/login', authController.login);

export default router;
