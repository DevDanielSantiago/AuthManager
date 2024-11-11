import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.CONFLICT,
        message,
      },
      HttpStatus.CONFLICT,
    );
  }
}
