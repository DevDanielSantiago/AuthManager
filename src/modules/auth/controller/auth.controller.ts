import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { AuthService } from '../service/auth.service';

import { LoginDto, ValidateDto } from '../dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async authentication(@Body() loginDto: LoginDto) {
    return this.authService.authentication(loginDto);
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() loginDto: ValidateDto) {
    return this.authService.validate(loginDto);
  }
}
