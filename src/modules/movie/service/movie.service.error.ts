import { NotFoundException } from '@nestjs/common';

export class MovieNotFoundError extends NotFoundException {
  constructor() {
    super('Cannot find the requested movie');
  }
}
