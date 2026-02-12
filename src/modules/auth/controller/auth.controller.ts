import { Controller, Post, Body, UseFilters, HttpCode } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthErrorFilter } from '../service/auth-error-filter.interceptor';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseFilters(AuthErrorFilter)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterUserDto, required: true })
  @ApiCreatedResponse({
    type: AuthResponseDto,
    description: 'User successfully registered',
  })
  async register(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<AuthResponseDto> {
    return await this.authService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: LoginUserDto, required: true })
  @ApiOkResponse({
    type: AuthResponseDto,
    description: 'User successfully logged in',
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    return await this.authService.login(loginUserDto);
  }
}
