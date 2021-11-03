import { IRole } from './role.interface';

export interface IUser {
  email: string,
  password: string
  roles: IRole[]
}
