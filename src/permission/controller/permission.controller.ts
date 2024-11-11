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

import { HeadersPermissionDto, PermissionDto } from 'src/permission/dto';
import { PermissionService } from 'src/permission/service/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async index(@Headers() headers: HeadersPermissionDto) {
    return this.permissionService.list(headers);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPermissionDto: PermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: PermissionDto,
  ) {
    return this.permissionService.update(id, updatePermissionDto);
  }
}
