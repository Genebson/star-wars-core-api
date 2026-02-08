import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  UserAlreadyExistsError,
  UserInvalidCredentialsError,
} from './auth.service.error';
import { Response } from 'express';

@Catch(Error)
export class AuthErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getHttpStatus(error);

    response.status(status).json({
      statusCode: status,
      error:
        error instanceof HttpException
          ? (error.getResponse() as { message: string }).message
          : error.message,
    });
  }

  private getHttpStatus(error: Error): HttpStatus {
    const validations = [
      {
        condition: error instanceof UserInvalidCredentialsError,
        httpStatus: HttpStatus.UNAUTHORIZED,
      },
      {
        condition: error instanceof UserAlreadyExistsError,
        httpStatus: HttpStatus.CONFLICT,
      },
    ];

    for (const validation of validations) {
      if (validation.condition) {
        return validation.httpStatus;
      }
    }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
