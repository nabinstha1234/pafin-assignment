export interface dbClient {
  user: string;
  password: string | undefined;
  database: string;
  host: string;
  port: number;
  ssl: boolean;
  max: number;
  idleTimeoutMillis: number;
}
