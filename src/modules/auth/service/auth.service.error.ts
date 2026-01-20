import { BadRequestException } from '@nestjs/common';

export class InvalidCredentialsError extends BadRequestException {
  constructor() {
    super('The given credentials are invalid');
  }
}

export class UserAlreadyExistsError extends BadRequestException {
  constructor() {
    super('The given email is already in use');
  }
}
