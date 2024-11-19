import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import {
  CreateUserDto,
  HeadersUserDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from '../dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async index(@Headers() headers: HeadersUserDto) {
    return this.userService.list(headers);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('password/:userId')
  async updatePassword(
    @Param('userId') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updatePassword(id, updateUserPasswordDto);
  }
}
