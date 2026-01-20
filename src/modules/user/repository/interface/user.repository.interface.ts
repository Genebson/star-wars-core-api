import { UserEntity } from '../user.entity';
import { ICreateUserInput } from './create-user.input.interface';

export interface IUserRepository {
  create(userData: ICreateUserInput): Promise<UserEntity>;
  getByEmail(email: string): Promise<UserEntity>;
}
