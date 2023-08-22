import type { PoolClient, QueryResult } from 'pg';
import { Pool } from 'pg';
import { injectable, inject } from 'inversify';

import config from '../config';
import { TYPES } from '../types';
import { ILogger } from '../interfaces/ILogger';

export interface IDataStoreRepository {
  query(text: string, params: Array<any>): Promise<QueryResult>;
  getClient(): Promise<PoolClient>;
}

@injectable()
export class DataStoreRepository implements IDataStoreRepository {
  private _pool = new Pool(config.dbObj);
  private _logger: ILogger;

  constructor(@inject(TYPES.Logger) logger: ILogger) {
    this._logger = logger;
    this._logger.init('DataAccessLayer');
  }

  public query = async (text: string, params: Array<any>): Promise<QueryResult> => {
    const start: number = Date.now();
    try {
      const result: QueryResult = await this._pool.query(text, params);
      const duration: number = Date.now() - start;
      this._logger.info({
        operation: 'query',
        message: `Executed query ${text} in ${duration} ms.`,
        data: { text, duration, rowCount: result.rowCount },
      });
      return result;
    } catch (error) {
      this._logger.error({
        operation: 'query',
        message: `Error executing query ${text}`,
        data: { text, params, error },
      });
      throw error;
    }
  };

  public getClient = async (): Promise<PoolClient> => {
    try {
      const client: PoolClient = await this._pool.connect();
      this._logger.debug({
        operation: 'getClient',
        message: 'Acquired a database client.',
      });
      return client;
    } catch (error) {
      this._logger.error({
        operation: 'getClient',
        message: 'Error acquiring database client',
        data: { error },
      });
      throw error;
    }
  };
}
