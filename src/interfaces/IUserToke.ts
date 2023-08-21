export interface IUserToken {
  token: string;
  expiresIn: Date;
  tokenType: string;
  user: any;
}

export interface IUserTokenDocument extends IUserToken {}

export interface IUserTokenCreate {
  payload: any;
  secretKey: string;
  user: string;
  tokenType: IUserToken['tokenType'];
  expiresIn: string;
}

export interface IUserTokenDeleteByToken {
  token: string;
}

export interface IUserTokenDeleteByUserId {
  user_id: string;
}
