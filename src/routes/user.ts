import { Router } from 'express';

import config from '../config';
import { TYPES } from '../types';
import container from '../inversify.config';
import UserController from '../controllers/UserController';

const userController: UserController = container.get<UserController>(TYPES.UserController);
const router = Router();
const { roles } = config;

router.get('/:_id', userController.getUser);
router.get('/', userController.getUsers);
router.post('/', userController.createUser);
router.patch('/:_id', userController.updateUser);
router.delete('/:_id', userController.deleteUser);

export default router;
