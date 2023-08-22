import { UserCreateDTO, UserDTO, UserUpdateDTO } from '../../dto/UserDTO';
import { IPagingArgs, IPaginationData } from '../../interfaces/IPagination';

export interface IUserService {
  getAll(filters?: IPagingArgs): Promise<IPaginationData<UserDTO[]>>;
  getById(id: string): Promise<UserDTO | null>;
  create(args: UserCreateDTO): Promise<UserDTO | null>;
  update(args: { _id: string } & UserUpdateDTO): Promise<UserDTO | null>;
  delete(id: string): Promise<UserDTO | null>;
}
