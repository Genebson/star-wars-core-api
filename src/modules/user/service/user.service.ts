import { Injectable, Inject } from '@nestjs/common';
import { ICreateUserInput } from './interface/create-user.input.interface';
import { UserEntity } from '../repository/user.entity';
import { IUserRepository } from '../repository/interface/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY') private readonly userRepository: IUserRepository,
  ) {}

  async create(createUserData: ICreateUserInput): Promise<UserEntity> {
    return this.userRepository.create({
      email: createUserData.email,
      password: createUserData.password,
    });
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.getByEmail(email);
  }
}
