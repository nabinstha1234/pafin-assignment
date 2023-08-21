export class UserDTO {
  id: number;
  email: string;
  name: string;
  created_by: string;
  created_at: Date;
  modified_by: string;
  modified_at: Date;
  deleted: boolean;
  deleted_by: string;
  deleted_at: Date;
}

export class UserCreateDTO {
  email: string;
  name: string;
  password: string;
}

export class UserUpdateDTO {
  email: string;
  name: string;
}
