import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
