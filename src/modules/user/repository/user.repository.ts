import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { ICreateUserInput } from './interface/create-user.input.interface';
import { IUserRepository } from './interface/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userData: ICreateUserInput): Promise<UserEntity> {
    const userToSave = new UserEntity();
    userToSave.email = userData.email;
    userToSave.password = userData.password;

    return this.userRepository.save(userToSave);
  }

  async getByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role'],
    });
  }
}
