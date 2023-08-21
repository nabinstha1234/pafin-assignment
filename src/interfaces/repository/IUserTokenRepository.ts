import { IUserToken, IUserTokenDeleteByToken, IUserTokenDeleteByUserId, IUserTokenDocument } from '../IUserToke';

export interface IUserTokenRepository {
  create(args: IUserToken): Promise<IUserTokenDocument>;
  getByToken(token: string): Promise<IUserTokenDocument | null>;
  deleteByToken(args: IUserTokenDeleteByToken): Promise<IUserTokenDocument | null>;
  deleteByUserId(args: IUserTokenDeleteByUserId): Promise<boolean>;
}
