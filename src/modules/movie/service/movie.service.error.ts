import { NotFoundException } from '@nestjs/common';

export class MovieNotFoundError extends NotFoundException {
  constructor(message = 'Cannot find the requested movie') {
    super(message);
    this.name = 'MovieNotFoundError';
  }
}
