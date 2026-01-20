import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { EncryptService } from '../../../common/service/encrypt.service';
import { RegisterUserDto } from '../../controller/dto/register-user.dto';
import { UserEntity } from '../../../user/repository/user.entity';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
} from '../auth.service.error';
import { LoginUserDto } from '../../controller/dto/login-user.dto';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let encryptService: EncryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        AuthService,
        {
          provide: UserService,
          useValue: {
            getByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: EncryptService,
          useValue: {
            encrypt: jest.fn(),
            compare: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    encryptService = module.get<EncryptService>(EncryptService);
  });

  describe('Register', () => {
    const registerUserDto: RegisterUserDto = {
      email: 'user@example.com',
      password: 'password',
    };

    it('Should create an user correctly and return an access token', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(undefined);

      const encryptedPassword = 'encrypted-password';
      jest
        .spyOn(encryptService, 'encrypt')
        .mockResolvedValue(encryptedPassword);

      const userCreatedMock = {
        email: registerUserDto.email,
        id: 1,
        role: 'REGULAR',
      } as UserEntity;
      jest.spyOn(userService, 'create').mockResolvedValue(userCreatedMock);

      const accessTokenMock = 'access-token-mock';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessTokenMock);

      const response = await authService.register(registerUserDto);

      expect(response).toEqual({ accessToken: accessTokenMock });
      expect(userService.getByEmail).toHaveBeenCalledWith(
        registerUserDto.email,
      );
      expect(encryptService.encrypt).toHaveBeenCalledWith(
        registerUserDto.password,
      );
      expect(userService.create).toHaveBeenCalledWith({
        email: registerUserDto.email,
        password: encryptedPassword,
      });
    });

    it('Should return an error if there is a user already created with the given email', async () => {
      jest
        .spyOn(userService, 'getByEmail')
        .mockResolvedValue({ email: registerUserDto.email } as UserEntity);

      try {
        await authService.register(registerUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(UserAlreadyExistsError);
        expect(encryptService.encrypt).toHaveBeenCalledTimes(0);
        expect(userService.create).toHaveBeenCalledTimes(0);
      }
    });
  });

  describe('Login', () => {
    const loginUserDto: LoginUserDto = {
      email: 'user@example.com',
      password: 'password',
    };

    it('Should login an user correctly and return an access token', async () => {
      const userCreatedMock = {
        email: loginUserDto.email,
        id: 1,
        role: 'REGULAR',
        password: 'stored-password',
      } as UserEntity;
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(userCreatedMock);

      jest.spyOn(encryptService, 'compare').mockResolvedValue(true);

      const accessTokenMock = 'access-token-mock';
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(accessTokenMock);

      const response = await authService.login(loginUserDto);

      expect(response).toEqual({ accessToken: accessTokenMock });
      expect(userService.getByEmail).toHaveBeenCalledWith(loginUserDto.email);
      expect(encryptService.compare).toHaveBeenCalledWith(
        loginUserDto.password,
        userCreatedMock.password,
      );
    });

    it('Should throw an error if there is no user stored with the given email', async () => {
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(undefined);

      try {
        await authService.login(loginUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidCredentialsError);
        expect(encryptService.compare).toHaveBeenCalledTimes(0);
      }
    });

    it('Should throw an error if the given password is not correct', async () => {
      const userCreatedMock = {
        email: loginUserDto.email,
        id: 1,
        role: 'REGULAR',
        password: 'stored-password',
      } as UserEntity;
      jest.spyOn(userService, 'getByEmail').mockResolvedValue(userCreatedMock);

      jest.spyOn(encryptService, 'compare').mockResolvedValue(true);

      try {
        await authService.login(loginUserDto);
      } catch (err) {
        expect(err).toBeInstanceOf(InvalidCredentialsError);
      }
    });
  });
});
