import { inject, injectable } from 'inversify';

import config from '../config';
import { TYPES } from '../types';
import { IUserRepository } from '../interfaces/repository/IUserRepository';

import { IUserService } from '../interfaces/services/IUserService';
import { IErrorService } from '../interfaces/services/IErrorService';

import { IPagingArgs, IPaginationData } from '../interfaces/IPagination';
import { ILogger } from '../interfaces/ILogger';

import Paging from '../utils/Pagination';
import { IDbTransactionRepository } from '../repository/DbTransactionRepository';
import { UserCreateDTO, UserDTO, UserUpdateDTO } from '../dto/UserDTO';

@injectable()
export default class UserService implements IUserService {
  private name = 'UserService';
  private userRepository: IUserRepository;
  private logger: ILogger;
  private errorService: IErrorService;
  private dbTransaction: IDbTransactionRepository;

  constructor(
    @inject(TYPES.UserRepository) userRepository: IUserRepository,
    @inject(TYPES.ErrorService) errorService: IErrorService,
    @inject(TYPES.DbTransaction) dbTransaction: IDbTransactionRepository
  ) {
    this.userRepository = userRepository;
    this.errorService = errorService;
    this.dbTransaction = dbTransaction;
  }

  getAll = async (args?: any): Promise<IPaginationData<UserDTO[]>> => {
    const operation = 'getAll';
    const pagingArgs: IPagingArgs = Paging.getPagingArgs(args);
    console.log(pagingArgs);
    try {
      await this.dbTransaction.begin();
      let { rows, count } = await this.userRepository.getAllAndCount(pagingArgs);
      const paging = Paging.getPagingResult(pagingArgs, { total: count });

      await this.dbTransaction.commit();

      return {
        paging,
        results: rows,
      };
    } catch (err) {
      await this.dbTransaction.rollback();

      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  getById = async (id: string) => {
    const operation = 'getById';
    try {
      this.dbTransaction.begin();
      let user = await this.userRepository.getById(id);
      await this.dbTransaction.commit();
      return user;
    } catch (err) {
      this.dbTransaction.rollback();
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  create = async (args: UserCreateDTO) => {
    const operation = 'create';
    const { email, name, password, authUserId } = args;

    try {
      await this.dbTransaction.begin();
      let user = await this.userRepository.create({
        email,
        name,
        password,
        authUserId,
      });
      await this.dbTransaction.commit();

      return user;
    } catch (err) {
      await this.dbTransaction.rollback();
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  update = async (args: { _id: string } & UserUpdateDTO) => {
    const operation = 'update';
    const { _id, email, name } = args;

    try {
      await this.dbTransaction.begin();
      let updated = await this.userRepository.update({
        _id,
        email,
        name,
      });

      await this.dbTransaction.commit();

      return updated;
    } catch (err) {
      await this.dbTransaction.rollback();
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };

  delete = async (id: string) => {
    const operation = 'delete';
    try {
      await this.dbTransaction.begin();
      let deletedUser = await this.userRepository.delete(id);
      await this.dbTransaction.commit();
      return deletedUser;
    } catch (err) {
      await this.dbTransaction.rollback();
      this.errorService.throwError({
        err,
        operation,
        name: this.name,
        logError: true,
      });
    }
  };
}
