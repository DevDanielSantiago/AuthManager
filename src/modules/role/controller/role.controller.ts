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

import { RoleService } from '../service/role.service';
import {
  HeadersRoleDto,
  CreateRoleDto,
  UpdateRoleDto,
} from 'src/modules/role/dto';
import { AuthGuard } from 'src/common/guards';
import { Permissions } from 'src/common/decorators';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard)
  @Permissions('role:list')
  @Get()
  async index(@Headers() headers: HeadersRoleDto) {
    return this.roleService.list(headers);
  }

  @UseGuards(AuthGuard)
  @Permissions('role:create')
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('role:update')
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  @UseGuards(AuthGuard)
  @Permissions('role:add')
  @Patch(':roleId/permission/:permissionId')
  async add(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.addPermission(roleId, permissionId);
  }

  @UseGuards(AuthGuard)
  @Permissions('role:remove')
  @Delete(':roleId/permission/:permissionId')
  async remove(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.removePermission(roleId, permissionId);
  }

  @UseGuards(AuthGuard)
  @Permissions('role:delete')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
