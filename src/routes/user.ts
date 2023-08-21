import { Router } from 'express';

import config from '../config';
import { TYPES } from '../types';
import container from '../inversify.config';
import UserController from '../controllers/UserController';
import authenticate from '../middlewares/authenticate';

const userController: UserController = container.get<UserController>(TYPES.UserController);
const router = Router();
const { roles } = config;

router.get('/:_id', authenticate, userController.getUser);
router.get('/', authenticate, userController.getUsers);
router.post('/', authenticate, userController.createUser);
router.patch('/:_id', authenticate, userController.updateUser);
router.delete('/:_id', authenticate, userController.deleteUser);

export default router;
