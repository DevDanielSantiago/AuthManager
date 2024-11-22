import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Permissions } from 'src/common/decorators';
import { AuthGuard } from 'src/common/guards';

import {
  HeadersPermissionDto,
  PermissionDto,
} from 'src/modules/permission/dto';
import { PermissionService } from 'src/modules/permission/service/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @UseGuards(AuthGuard)
  @Permissions('permission:list')
  @Get()
  async index(@Headers() headers: HeadersPermissionDto) {
    return this.permissionService.list(headers);
  }

  @UseGuards(AuthGuard)
  @Permissions('permission:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPermissionDto: PermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('permission:update')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: PermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('permission:delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.permissionService.delete(id);
  }
}
