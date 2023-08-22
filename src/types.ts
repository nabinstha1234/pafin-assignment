const TYPES = {
  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRespository'),
  UserController: Symbol.for('UserController'),
  AuthController: Symbol.for('AuthController'),
  AppService: Symbol.for('AppService'),
  AppController: Symbol.for('AppController'),
  Logger: Symbol.for('Logger'),
  TokenService: Symbol.for('TokenService'),
  AuthValidation: Symbol.for('AuthValidation'),
  AuthService: Symbol.for('AuthService'),
  EmailService: Symbol.for('EmailService'),
  UserTokenService: Symbol.for('UserTokenService'),
  UserTokenRepository: Symbol.for('UserTokenRepository'),
  UserTokenController: Symbol.for('UserTokenController'),
  AuthenticateMiddleware: Symbol.for('AuthenticateMiddleware'),
  ErrorService: Symbol.for('ErrorService'),
  JoiService: Symbol.for('JoiService'),
  DataStore: Symbol.for('DataStore'),
  DbTransaction: Symbol.for('DbTransaction'),
};

export { TYPES };
