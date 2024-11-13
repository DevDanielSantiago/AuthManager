import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof Error.ValidationError) {
      const formattedErrors = Object.values(exception.errors).map(
        (err: any) => ({
          field: err.path,
          message: err.message,
        }),
      );

      return response.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    if ((exception as any).code === 11000) {
      const duplicateKeyError = exception as MongoError;
      const keyPattern = duplicateKeyError['keyPattern'];
      const keyValue = duplicateKeyError['keyValue'];

      const errors = Object.keys(keyPattern).map((key) => ({
        field: key,
        message: `Duplicate value for field '${key}': '${keyValue[key]}'`,
      }));

      return response.status(HttpStatus.CONFLICT).json({
        status: HttpStatus.CONFLICT,
        message: 'Duplicate key error',
        errors: errors,
      });
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      return response.status(status).json({
        status: status,
        ...(typeof exceptionResponse === 'string'
          ? { message: exceptionResponse }
          : exceptionResponse),
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    });
  }
}
