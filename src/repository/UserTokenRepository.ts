import { inject, injectable } from 'inversify';

import { IUserTokenRepository } from '../interfaces/repository/IUserTokenRepository';
import { IDbTransactionRepository } from './DbTransactionRepository';
import { IDataStoreRepository } from './DataStoreRepository';
import { TYPES } from '../types';
import {
  IUserToken,
  IUserTokenDeleteByToken,
  IUserTokenDeleteByUserId,
  IUserTokenDocument,
} from '../interfaces/IUserToke';
import { IErrorService } from '../interfaces/services/IErrorService';

@injectable()
export default class UserTokenRepository implements IUserTokenRepository {
  private _dataStore: IDataStoreRepository;
  private _client: IDbTransactionRepository | undefined;
  private _errorService: IErrorService;
  constructor(
    @inject(TYPES.DataStore) dataStore: IDataStoreRepository,
    @inject(TYPES.DbTransaction) client: IDbTransactionRepository,
    @inject(TYPES.ErrorService) errorService: IErrorService
  ) {
    this._dataStore = dataStore;
    this._client = client;
    this._errorService = errorService;
  }

  async create(userToken: IUserToken): Promise<IUserTokenDocument> {
    try {
      await this._client?.begin();
      const query = `INSERT INTO token (user_id, token_value, expiration_date ) VALUES ($1, $2, $3) RETURNING *`;
      const values = [userToken.user, userToken.token, userToken.expiresIn];
      const resut = await this._dataStore.query(query, values);
      const tokenData: IUserTokenDocument = {
        token: resut.rows[0].token_value,
        expiresIn: resut.rows[0].expiration_date,
        tokenType: 'Bearer',
        user: resut.rows[0].user_id,
      };
      await this._client?.commit();
      return tokenData;
    } catch (error) {
      await this._client?.rollback();
      this._errorService.throwError({
        name: 'DATABASE_ERROR',
        err: error,
        operation: 'create',
        logError: true,
      });
    }
  }

  async getByToken(token: string): Promise<IUserTokenDocument | null> {
    try {
      await this._client?.begin();
      const query = `SELECT * FROM tokens WHERE token = $1`;
      const values = [token];
      const result = await this._dataStore.query(query, values);
      if (result.rowCount === 0) {
        return null;
      }

      await this._client?.commit();
      return result.rows[0];
    } catch (error) {
      await this._client?.rollback();
      this._errorService.throwError({
        name: 'DATABASE_ERROR',
        err: error,
        operation: 'getByToken',
        logError: true,
      });
    }
  }

  async deleteByToken(args: IUserTokenDeleteByToken): Promise<IUserTokenDocument | null> {
    try {
      await this._client?.begin();
      const query = `DELETE FROM tokens WHERE token = $1 RETURNING *`;
      const values = [args.token];
      const result = await this._dataStore.query(query, values);

      if (result.rowCount === 0) {
        return null;
      }

      await this._client?.commit();
      return result.rows[0];
    } catch (error) {
      await this._client?.rollback();
      this._errorService.throwError({
        name: 'DATABASE_ERROR',
        err: error,
        operation: 'deleteByToken',
        logError: true,
      });
    }
  }

  async deleteByUserId(args: IUserTokenDeleteByUserId): Promise<boolean> {
    try {
      await this._client?.begin();
      const query = `DELETE FROM tokens WHERE user_id = $1`;
      const values = [args.user_id];
      const result = await this._dataStore.query(query, values);
      if (result.rowCount === 0) {
        return false;
      }
      await this._client?.commit();
      return true;
    } catch (error) {
      await this._client?.rollback();
      this._errorService.throwError({
        name: 'DATABASE_ERROR',
        err: error,
        operation: 'deleteByUserId',
        logError: true,
      });
    }
  }
}
