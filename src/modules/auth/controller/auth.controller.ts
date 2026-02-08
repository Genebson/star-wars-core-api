import { Controller, Post, Body, HttpCode, UseFilters } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { IRegisterUserOutput } from '../service/interface/register-user.output.interface';
import { ILoginUserOutput } from '../service/interface/login-user.output.interface';
import { AuthErrorFilter } from '../service/auth-error-filter.interceptor';

@ApiTags('Authentication')
@Controller('auth')
@UseFilters(AuthErrorFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto, required: true })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<IRegisterUserOutput> {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiBody({ type: LoginUserDto, required: true })
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto): Promise<ILoginUserOutput> {
    return await this.authService.login(loginUserDto);
  }
}
