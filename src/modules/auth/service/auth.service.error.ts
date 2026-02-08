import { BadRequestException } from '@nestjs/common';

export class UserInvalidCredentialsError extends BadRequestException {
  constructor(message = 'The given credentials are invalid') {
    super(message);
    this.name = 'InvalidCredentialsError';
  }
}

export class UserAlreadyExistsError extends BadRequestException {
  constructor(message = 'The given email is already in use') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}
