import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.BAD_REQUEST,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
