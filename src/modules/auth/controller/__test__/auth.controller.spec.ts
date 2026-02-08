import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcryptjs from 'bcryptjs';
import * as request from 'supertest';

import { AppModule } from '../../../../app.module';
import { RegisterUserDto } from '../dto/register-user.dto';
import { JwtService } from '@nestjs/jwt';
import { loadFixtures } from '../../../../config/database.loader';
import { join } from 'path';
import { LoginUserDto } from '../dto/login-user.dto';

describe('AuthController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    await loadFixtures(
      `${__dirname}/fixture`,
      join(__dirname, '../../../../config/database.config.ts'),
    );

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();
  });

  describe('Register', () => {
    it('Should register an user and return an accessToken correctly', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'new@example.com',
        password: 'password',
      };

      const mockResolvedToken = 'eyAbc';
      jest
        .spyOn(JwtService.prototype, 'signAsync')
        .mockResolvedValue(mockResolvedToken);

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerUserDto)
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          expect(body).toEqual({ accessToken: mockResolvedToken });
        });
    });

    it('Should return an error if trying to register an already created user', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'existing@example.com',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/auth/register')
        .send(registerUserDto)
        .expect(HttpStatus.CONFLICT)
        .then(({ body }) => {
          expect(body.error).toEqual('The given email is already in use');
        });
    });
  });

  describe('Login', () => {
    it('Should login and return an accessToken if the credentials are valid', async () => {
      const mockResolvedToken = 'eyAbc';
      jest
        .spyOn(JwtService.prototype, 'signAsync')
        .mockResolvedValue(mockResolvedToken);

      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true as never);

      const loginUserDto: LoginUserDto = {
        email: 'existing@example.com',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.OK)
        .then(({ body }) => {
          expect(body).toEqual({ accessToken: mockResolvedToken });
        });
    });

    it('Should return an error if trying to login with a non-existing user', async () => {
      const mockResolvedToken = 'eyAbc';
      jest
        .spyOn(JwtService.prototype, 'signAsync')
        .mockResolvedValue(mockResolvedToken);

      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(true as never);

      const loginUserDto: LoginUserDto = {
        email: 'non-existing@example.com',
        password: 'password',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.error).toEqual('The given credentials are invalid');
        });
    });

    it('Should return an error if trying to login with an incorrect password', async () => {
      jest.spyOn(bcryptjs, 'compare').mockResolvedValue(false as never);

      const loginUserDto: LoginUserDto = {
        email: 'existing@example.com',
        password: 'incorrect-password',
      };

      return request(app.getHttpServer())
        .post('/auth/login')
        .send(loginUserDto)
        .expect(HttpStatus.UNAUTHORIZED)
        .then(({ body }) => {
          expect(body.error).toEqual('The given credentials are invalid');
        });
    });
  });
});
