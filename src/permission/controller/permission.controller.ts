import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { PermissionDto } from 'src/permission/dto';
import { PermissionService } from 'src/permission/service/permission.service';

@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPermissionDto: PermissionDto) {
    return this.permissionService.create(createPermissionDto);
  }
}
