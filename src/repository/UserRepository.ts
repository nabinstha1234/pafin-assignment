import { injectable, inject } from 'inversify';
import _ from 'lodash';
import isNil from 'lodash/isNil';
import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import { QueryResult } from 'pg';
import { ulid } from 'ulid';

import { TYPES } from '../types';
import config from '../config';
import { UserDTO, UserUpdateDTO } from '../dto/UserDTO';
import { IUserRepository } from '../interfaces/repository/IUserRepository';
import { IPagingArgs, IGetAllAndCountResult } from '../interfaces/IPagination';
import { ValidationError, NotFoundError, ConflictError } from '../utils/ApiError';
import { IDataStoreRepository } from './DataStoreRepository';
import { IErrorService } from '../interfaces/services/IErrorService';

@injectable()
export default class UserRepository implements IUserRepository {
  private name = 'UserRepository';
  private _dataStore: IDataStoreRepository;
  private errorService: IErrorService;
  constructor(
    @inject(TYPES.DataStore) dal: IDataStoreRepository,
    @inject(TYPES.ErrorService) errorService: IErrorService
  ) {
    this._dataStore = dal;
    this.errorService = errorService;
  }

  async getAllAndCount(pagingArgs: IPagingArgs): Promise<IGetAllAndCountResult<UserDTO[]>> {
    const { skip, limit, sort, query } = pagingArgs;

    let selectQuery = `
        SELECT created_by, created_at, modified_by, modified_at, deleted, deleted_by, deleted_at, id, email, name
        FROM users
        OFFSET $1 LIMIT $2;
    `;

    if (sort && sort.column && sort.order) {
      selectQuery += `
      ORDER BY ${sort.column} ${sort.order}
     `;
    }

    const countQuery = `
        SELECT COUNT(*)
        FROM users
    `;

    const selectParams = [<number>skip, <number>limit];

    try {
      const [dataResult, countResult] = await Promise.all([
        this._dataStore.query(selectQuery, selectParams),
        this._dataStore.query(countQuery, []),
      ]);
      const totalCount = parseInt(countResult.rows[0].count, 10);
      const dataRows: UserDTO[] = dataResult.rows.map((row) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        created_at: row.created_at,
        updated_at: row.updated_at,
        created_by: row.created_by,
        updated_by: row.updated_by,
        deleted_at: row.deleted_at,
        deleted_by: row.deleted_by,
        deleted: row.deleted,
        modified_at: row.modified_at,
        modified_by: row.modified_by,
      }));
      return {
        count: totalCount,
        rows: dataRows,
      };
    } catch (error) {
      throw this.errorService.throwError({
        err: error,
        operation: 'getAllAndCount',
        name: this.name,
        logError: true,
      });
    }
  }

  async getById(id: string): Promise<UserDTO | null> {
    try {
      const query: string = `SELECT * FROM users WHERE id = $1`;
      const values = [id];

      const result: QueryResult = await this._dataStore.query(query, values);

      if (result.rowCount === 0) {
        throw new NotFoundError({
          message: config.translationKey.userNotFound,
          details: [config.translationKey.userNotFound],
          data: { id },
        });
      }

      const userDTO: UserDTO = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        created_at: result.rows[0].created_at,
        created_by: result.rows[0].created_by,
        deleted_at: result.rows[0].deleted_at,
        deleted_by: result.rows[0].deleted_by,
        deleted: result.rows[0].deleted,
        modified_at: result.rows[0].modified_at,
        modified_by: result.rows[0].modified_by,
      };

      return userDTO;
    } catch (error) {
      throw this.errorService.throwError({
        err: error,
        operation: 'getById',
        name: this.name,
        logError: true,
      });
    }
  }

  async create(args: any): Promise<UserDTO | null> {
    const { email, name, password, authUserId } = args;
    const errors = [];
    if (isNil(email) || !isString(email)) {
      errors.push(config.translationKey.emailRequired);
    }

    if (isNil(password) || !isString(password)) {
      errors.push(config.translationKey.passwordValidation);
    }

    if (isNil(name) || !isString(name)) {
      errors.push(config.translationKey.nameValidation);
    }

    if (errors.length) {
      throw new ValidationError({
        message: config.translationKey.validationError,
        details: errors,
      });
    }

    let foundUser: UserDTO | null = await this.getUserByEmail(email);
    if (!isEmpty(foundUser)) {
      throw new ConflictError({
        message: config.translationKey.userNotFound,
        details: [config.translationKey.userNotFound],
        data: { email },
      });
    }

    const insertQuery = `
          INSERT INTO users (id, name, password, email, created_by)
          VALUES ($1, $2, $3, $4, $5);
        `;
    const id = ulid();
    const insertParams = [id, name, password, email, authUserId];

    const insertResult: QueryResult = await this._dataStore.query(insertQuery, insertParams);

    if (insertResult.rowCount !== 1) {
      this.errorService.throwError({
        err: new Error(`Error creating user`),
        operation: 'create',
        name: this.name,
        logError: true,
      });
    }

    const result = await this.getById(id);
    return result;
  }

  async getUserByEmail(email: string): Promise<UserDTO | null> {
    try {
      const query: string = `SELECT * FROM users WHERE email = $1`;
      const values = [email];

      const result: QueryResult = await this._dataStore.query(query, values);

      if (result.rowCount === 0) {
        return null;
      }

      const userDTO: UserDTO = {
        id: result.rows[0].id,
        email: result.rows[0].email,
        name: result.rows[0].name,
        created_at: result.rows[0].created_at,
        created_by: result.rows[0].created_by,
        deleted_at: result.rows[0].deleted_at,
        deleted_by: result.rows[0].deleted_by,
        deleted: result.rows[0].deleted,
        modified_at: result.rows[0].modified_at,
        modified_by: result.rows[0].modified_by,
      };
      return userDTO;
    } catch (error) {
      throw this.errorService.throwError({
        err: error,
        operation: 'getUserByEmail',
        name: this.name,
        logError: true,
      });
    }
  }

  async update(args: UserUpdateDTO & { _id: string }): Promise<UserDTO> {
    try {
      const { email, name, _id } = args;

      await this.getById(_id);

      const updateFields: any = {
        email,
        name,
      };

      const validUpdateFields = _.omitBy(updateFields, _.isUndefined);
      const updateStrings = _.map(validUpdateFields, (value, key) => `${key} = '${value}'`);

      if (_.isEmpty(updateStrings)) {
        throw this.errorService.throwError({
          err: new Error(`No valid update fields provided.`),
          operation: 'update',
          name: this.name,
          logError: true,
        });
      }

      const updateQuery = `
            UPDATE users SET ${updateStrings.join(', ')} WHERE id = '${_id}'`;

      const result: QueryResult = await this._dataStore.query(updateQuery, []);

      if (result.rowCount !== 1) {
        throw this.errorService.throwError({
          err: new Error(`Error updating user`),
          operation: 'update',
          name: this.name,
          logError: true,
        });
      }

      const userDTO = await this.getById(_id);

      if (!userDTO) {
        throw this.errorService.throwError({
          err: new Error(`Error updating user`),
          operation: 'update',
          name: this.name,
          logError: true,
        });
      }
      return userDTO;
    } catch (error) {
      throw this.errorService.throwError({
        err: error,
        operation: 'update',
        name: this.name,
        logError: true,
      });
    }
  }

  async delete(id: string): Promise<UserDTO> {
    try {
      const query: string = `DELETE FROM users WHERE id = $1`;
      const values = [id];

      const user = await this.getById(id);

      if (!user) {
        throw new NotFoundError({
          message: config.translationKey.userExists,
          details: [config.translationKey.userExists],
          data: { id },
        });
      }

      const result: QueryResult = await this._dataStore.query(query, values);

      if (result.rowCount !== 1) {
        throw this.errorService.throwError({
          err: new Error(`Error deleting user`),
          operation: 'delete',
          name: this.name,
          logError: true,
        });
      }
      return user;
    } catch (error) {
      throw this.errorService.throwError({
        err: error,
        operation: 'delete',
        name: this.name,
        logError: true,
      });
    }
  }

  async comparePassword(password: string, userId: string): Promise<boolean> {
    try {
      const query: string = `
           SELECT * FROM users
           WHERE id = $1
           AND password = crypt($2, password);`;
      const values = [userId, password];

      const result: QueryResult = await this._dataStore.query(query, values);

      if (result.rowCount === 0) {
        return false;
      }

      return true;
    } catch (error) {
      throw this.errorService.throwError({
        err: error,
        operation: 'comparePassword',
        name: this.name,
        logError: true,
      });
    }
  }
}
