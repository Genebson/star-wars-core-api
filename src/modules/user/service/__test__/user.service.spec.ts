import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { IUserRepository } from '../../repository/interface/user.repository.interface';
import { ICreateUserInput } from '../interface/create-user.input.interface';
import { UserEntity } from '../../repository/user.entity';
import { UserRole } from '../../repository/enum/user.role.enum';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: {
            create: jest.fn(),
            getByEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<IUserRepository>('USER_REPOSITORY');
  });

  const storedUserRepositoryResponse = {
    id: 1,
    email: 'user@example.com',
    password: 'password',
    role: UserRole.REGULAR,
  } as UserEntity;

  describe('Create', () => {
    it('Should create an user correctly', async () => {
      jest
        .spyOn(userRepository, 'create')
        .mockResolvedValue(storedUserRepositoryResponse);

      const createUserData: ICreateUserInput = {
        email: 'user@example.com',
        password: 'password',
      };

      const userCreated = await userService.create(createUserData);

      expect(userCreated).toEqual(storedUserRepositoryResponse);
      expect(userRepository.create).toHaveBeenCalledWith(createUserData);
    });
  });

  describe('Get by email', () => {
    it('Should return an user with the given email', async () => {
      jest
        .spyOn(userRepository, 'getByEmail')
        .mockResolvedValue(storedUserRepositoryResponse);

      const userEmail = 'user@example.com';
      const userStored = await userService.getByEmail(userEmail);

      expect(userStored).toEqual(storedUserRepositoryResponse);
      expect(userRepository.getByEmail).toHaveBeenCalledWith(userEmail);
    });
  });
});
