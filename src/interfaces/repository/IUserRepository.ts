import { UserCreateDTO, UserDTO, UserUpdateDTO } from '../../dto/UserDTO';
import { IPagingArgs, IGetAllAndCountResult } from '../IPagination';

export interface IUserRepository {
  getAllAndCount(pagingArgs: IPagingArgs): Promise<IGetAllAndCountResult<any[]>>;
  getById(id: string): Promise<any | null>;
  //   getUsers(query: any): Promise<IUserDocument[]>;
  //   getUser(query: any): Promise<IUserDocument | null>;
  create(user: UserCreateDTO): Promise<UserDTO | null>;
  update(user: UserUpdateDTO & { _id: string }): Promise<UserDTO | null>;
  delete(id: string): Promise<UserDTO | null>;
}
