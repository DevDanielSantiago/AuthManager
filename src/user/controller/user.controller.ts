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
  Req,
} from '@nestjs/common';
import { UserService } from '../service';
import {
  CreateUserDto,
  HeadersUserDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
} from '../dto';
import { ClientInfoDto } from 'src/dto';

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

  @Patch('email/:userId')
  async updateEmail(
    @Param('userId') id: string,
    @Body() updateUserEmailDto: UpdateUserEmailDto,
    @Req() request: ClientInfoDto,
  ) {
    return this.userService.updateEmail(id, updateUserEmailDto, request);
  }

  @Patch('email/confirm/:token')
  async confirmUpdateEmail(@Param('token') token: string) {
    return this.userService.confirmUpdateEmail(token);
  }

  @Patch('email/ignore/:token')
  async ignoreUpdateEmail(@Param('token') token: string) {
    return this.userService.ignoreUpdateEmail(token);
  }
}
