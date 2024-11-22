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
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import {
  CreateUserDto,
  HeadersUserDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
} from '../dto';
import { ClientInfoDto } from 'src/common/dto';

import { AuthGuard } from 'src/common/guards';
import { Permissions } from 'src/common/decorators';
import { RequestPayloadDTO } from 'src/common/dto/request-payload.tdo';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Permissions('user:list')
  @Get()
  async index(@Headers() headers: HeadersUserDto) {
    return this.userService.list(headers);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('user:self')
  @Patch()
  async update(
    @Req() req: RequestPayloadDTO,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(req.user._id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('user:self')
  @Patch('password')
  async updatePassword(
    @Req() req: RequestPayloadDTO,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.userService.updatePassword(req.user._id, updateUserPasswordDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('user:self')
  @Patch('email')
  async updateEmail(
    @Req() req: RequestPayloadDTO,
    @Body() updateUserEmailDto: UpdateUserEmailDto,
    @Req() request: ClientInfoDto,
  ) {
    return this.userService.updateEmail(
      req.user._id,
      updateUserEmailDto,
      request,
    );
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
