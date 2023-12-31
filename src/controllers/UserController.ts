import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';

import config from '../config';
import { TYPES } from '../types';
import { IUserService } from '../interfaces/services/IUserService';
import { IJoiService } from '../interfaces/services/IJoiService';
import { ILogger } from '../interfaces/ILogger';
import { IPaginationData } from '../interfaces/IPagination';
import { UserDTO } from '../dto/UserDTO';
import UserValidation from '../validation/UserValidation';

const translationKey = config.translationKey;

@injectable()
export default class UserController {
  private name = 'UserController';
  private userService: IUserService;
  private joiService: IJoiService;
  private logger: ILogger;

  constructor(@inject(TYPES.UserService) userService: IUserService, @inject(TYPES.JoiService) joiService: IJoiService) {
    this.userService = userService;
    this.joiService = joiService;
  }

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'getUsers';

    try {
      let result: IPaginationData<UserDTO[]> = await this.userService.getAll(req.query || {});

      return res.status(200).send({
        message: res.__(translationKey.userListedSuccess),
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'getUser';

    try {
      const _id = req.params._id;
      let user = await this.userService.getById(_id);
      if (!user) {
        return res.status(404).send({
          message: res.__(translationKey.userNotFound),
          data: {},
        });
      }

      return res.status(200).send({
        message: res.__(translationKey.userListedSuccess),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'createUser';

    try {
      const args = req.body;
      const _req = req as any;
      const email = args?.email;
      const password = args?.password;
      const name = args?.name;
      const schema = UserValidation.create();
      await this.joiService.validate({
        schema,
        input: {
          email,
          password,
          name,
        },
      });

      let user = await this.userService.create({
        email,
        password,
        name,
        authUserId: _req?.user?._id,
      });

      return res.status(200).send({
        message: res.__(translationKey.userCreateSuccess),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'updateUser';

    try {
      const _req = req as any;
      const _id = _req.params._id;
      const args = req.body;

      const { email, name } = args;
      //   if (_id !== _req?.user?._id && _req?.user?.role !== config.roles.admin) {
      //     return res.status(403).send({
      //       message: res.__(translationKey.forbidden),
      //       data: { _id },
      //     });
      //   }

      const schema = UserValidation.update();
      await this.joiService.validate({
        schema,
        input: {
          email,
          name,
        },
      });

      let user = await this.userService.update({
        _id,
        name,
        email,
      });

      return res.status(200).send({
        message: res.__(translationKey.userUpdateSuccess),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const operation = 'deleteUser';
    const _req = req as any;

    try {
      const _id = _req.params._id;
      const data = req.body;

      if (_id === _req?.user?._id) {
        return res.status(403).send({
          message: res.__(translationKey.cannotDeleteOwnAccount),
          data: {
            _id,
          },
        });
      }

      let user = await this.userService.delete(_id);
      if (!user) {
        return res.status(404).send({
          message: res.__(translationKey.userNotFound),
          data: user,
        });
      }

      return res.status(200).send({
        message: res.__(translationKey.userDeleteSuccess),
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };
}
