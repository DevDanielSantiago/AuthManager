import { Controller, Get, Headers } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { HeadersUserDto } from '../dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index(@Headers() headers: HeadersUserDto) {
    return this.userService.list(headers);
  }
}
