import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../controller/dto/register-user.dto';
import { UserService } from '../../user/service/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../controller/dto/login-user.dto';
import { EncryptService } from '../../common/service/encrypt.service';
import {
  UserInvalidCredentialsError,
  UserAlreadyExistsError,
} from './auth.service.error';
import { IRegisterUserOutput } from './interface/register-user.output.interface';
import { ILoginUserOutput } from './interface/login-user.output.interface';
import { IGenerateAccessTokenPayloadInput } from './interface/generate-access-token-payload.input.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly encryptService: EncryptService,
    private readonly configService: ConfigService,
  ) {}

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<IRegisterUserOutput> {
    const { email, password } = registerUserDto;

    const storedUser = await this.userService.getByEmail(email);
    if (storedUser) {
      throw new UserAlreadyExistsError();
    }

    const encryptedPassword = await this.encryptService.encrypt(password);
    const userCreated = await this.userService.create({
      email,
      password: encryptedPassword,
    });

    const accessToken = await this.generateAccessToken({
      email: userCreated.email,
      id: userCreated.id,
      role: userCreated.role,
    });

    return { accessToken };
  }

  async login(loginUserDto: LoginUserDto): Promise<ILoginUserOutput> {
    const storedUser = await this.userService.getByEmail(loginUserDto.email);

    if (!storedUser) {
      throw new UserInvalidCredentialsError();
    }

    const isPasswordValid = await this.encryptService.compare(
      loginUserDto.password,
      storedUser.password,
    );

    if (isPasswordValid) {
      const accessToken = await this.generateAccessToken({
        email: loginUserDto.email,
        id: storedUser.id,
        role: storedUser.role,
      });

      return { accessToken };
    }

    throw new UserInvalidCredentialsError();
  }

  private generateAccessToken(
    payload: IGenerateAccessTokenPayloadInput,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: '1h',
    });
  }
}
