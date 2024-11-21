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
} from '@nestjs/common';

import { RoleService } from '../service/role.service';
import {
  HeadersRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
} from 'src/modules/role/dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  async index(@Headers() headers: HeadersRoleDto) {
    return this.roleService.list(headers);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @Patch(':roleId/permission/:permissionId')
  async add(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.addPermission(roleId, permissionId);
  }

  @Delete(':roleId/permission/:permissionId')
  async remove(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.removePermission(roleId, permissionId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
