import { IsEmail, IsEnum, IsNumber } from 'class-validator';
import { RolesType } from '../enum/roles.enum';

export class AccessTokenDto {
  @IsNumber()
  id: number;

  @IsEmail()
  email: string;

  @IsEnum({ type: RolesType })
  role: RolesType;
}
