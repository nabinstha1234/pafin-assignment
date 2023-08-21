import { IUserLogin, IUserLoginResponse } from '../IUser';

export interface IAuthService {
  login(args: IUserLogin): Promise<IUserLoginResponse>;
  renewAccessToken(refreshToken: string): Promise<IUserLoginResponse>;
}
