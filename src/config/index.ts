import * as dotenv from 'dotenv';

import translationKey from './translationKey';

dotenv.config();

const originsEnv = process.env.ORIGINS;
let origins: Array<string>;
try {
  origins = (originsEnv as string).split(',');
} catch (err) {
  origins = ['http://localhost:3000'];
}

export default {
  origins,
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT,
  baseUrl: process.env.BASE_URL,
  appName: process.env.APP_NAME || 'boilerplate',
  secretKey: process.env.SECRET_KEY || 'secretKey',
  refreshTokenKey: process.env.REFRESH_TOKEN_SECRET_KEY || 'refreshSecretKey',
  refreshTokenCookieName: process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken',
  translationKey,
  saltRounds: process.env.SALT_ROUNDS || 10,
  verificationEmailTokenExpiration: process.env.VERIFICATION_EMAIL_EXPIRATION || '1d',
  authTokenExpiration: process.env.AUTH_TOKEN_EXPIRATION || '10s',
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  forgotPasswordTokenExpiration: process.env.FORGOT_PASSWORD_TOKEN_EXPIRATION || '1hr',
  tokenType: {
    refresh: 'refresh',
  },
  languages: {
    english: 'en',
    japanese: 'jp',
  },
  dbObj: {
    user: process.env.DBUSER || 'db_username',
    password: process.env.DBPASSWORD || 'db_password',
    database: process.env.DBNAME || 'db_dbname',
    host: process.env.DBHOST || 'localhost',
    port: 5432,
    ssl: false,
    max: 20,
    idleTimeoutMillis: 10000,
  },
  roles: {
    admin: 'admin',
    user: 'user',
  },
  models: {
    User: 'User',
    UserToken: 'UserToken',
  },
  log: {
    fileLogLevel: process.env.FILE_LOG_LEVEL,
    dirname: process.env.LOG_DIRNAME,
    errorLogFilename: process.env.ERROR_LOG_FILENAME || 'error',
    logLevels: {
      error: 'error',
      warn: 'warn',
      info: 'info',
      verbose: 'verbose',
      debug: 'debug',
      silly: 'silly',
    },
  },
  acl: {
    // acl values goes here, eg. user: ['admin', 'user']
  },
  events: {
    onSignUp: 'onSignUp',
  },
  appVersion: process.env.APP_VERSION || 'v1',
};
