import { inject, injectable } from 'inversify';
import { PoolClient } from 'pg';

import { IDataStoreRepository } from './DataStoreRepository';
import { ILogger } from '../interfaces/ILogger';
import { TYPES } from '../types';

export interface IDbTransactionRepository {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

@injectable()
export class DbTransactionRepository implements IDbTransactionRepository {
  private _dataStore: IDataStoreRepository;
  private _client: PoolClient | undefined;
  private _logger: ILogger;

  constructor(@inject(TYPES.DataStore) dataStore: IDataStoreRepository, @inject(TYPES.Logger) logger: ILogger) {
    this._dataStore = dataStore;
    this._logger = logger;
  }

  public async begin(): Promise<void> {
    try {
      this._client = await this._dataStore.getClient();
      await this._client.query('BEGIN');
    } catch (error) {
      this._logger.error({
        message: 'Error starting transaction',
        data: { error },
        operation: 'begin',
      });
      throw new Error('Failed to start transaction');
    }
  }

  public async commit(): Promise<void> {
    try {
      if (!this._client) {
        throw new Error('Transaction client not available');
      }
      await this._client.query('COMMIT');
    } catch (error) {
      this._logger.error({
        message: 'Error committing transaction',
        data: { error },
        operation: 'commit',
      });
      throw new Error('Failed to commit transaction');
    } finally {
      if (this._client) {
        this._client.release();
      }
    }
  }

  public async rollback(): Promise<void> {
    try {
      if (!this._client) {
        return;
      }
      await this._client.query('ROLLBACK');
    } catch (error) {
      this._logger.error({
        message: 'Error rolling back transaction',
        data: { error },
        operation: 'rollback',
      });
    } finally {
      if (this._client) {
        this._client.release();
      }
    }
  }
}
