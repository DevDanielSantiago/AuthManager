import { Injectable } from '@nestjs/common';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from 'src/exception';

import { ListResponseDto, MessageResponseDto } from 'src/dto';
import {
  CreateRoleDto,
  HeadersRoleDto,
  ResponseRoleDto,
  UpdateRoleDto,
} from 'src/role/dto';

import { RoleRepository } from 'src/role/repository/role.repository';
import { PermissionRepository } from 'src/permission/repository/permission.repository';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
  ) {}

  async list(
    headers: HeadersRoleDto,
  ): Promise<ListResponseDto<ResponseRoleDto>> {
    const page = parseInt(headers['x-page'], 10) || 1;
    const limit = parseInt(headers['x-limit'], 10) || 10;

    const filterName = headers['x-filter-name'];

    const filters: Record<string, RegExp> = { deletedAt: null };
    if (filterName) filters['name'] = new RegExp(filterName, 'i');

    const list = await this.roleRepository.find(filters, page, limit);
    const count = await this.roleRepository.count(filters);

    return { count, list };
  }

  async create(role: CreateRoleDto): Promise<MessageResponseDto> {
    const findRole = await this.roleRepository.findOne({
      name: role.name,
      deletedAt: null,
    });
    if (findRole) throw new ConflictException('Role already exists');

    const result = await Promise.all(
      role.permissions.map((_id) => this.permissionRepository.findOne({ _id })),
    );
    if (result.includes(null))
      throw new ConflictException("One or more permissions doesn't exist");

    await this.roleRepository.create(role);
    return { message: 'Role created sucessfully' };
  }

  async update(id: string, role: UpdateRoleDto): Promise<MessageResponseDto> {
    const findRole = await this.roleRepository.findOne({ _id: id });
    if (!findRole) throw new ConflictException("Role doesn't exists");

    const findName = await this.roleRepository.findOne({
      name: role.name,
      deletedAt: null,
      _id: { $ne: id },
    });

    if (findName) throw new ConflictException('Role already exists');

    await this.roleRepository.update(id, role);
    return { message: 'Role updated sucessfully' };
  }

  async addPermission(
    id: string,
    permissionId: string,
  ): Promise<MessageResponseDto> {
    const findRole = await this.roleRepository.findOne({ _id: id });
    if (!findRole) throw new ConflictException("Role doesn't exists");

    const checkPermission = findRole.permissions.find(
      (permission: string) => permission === permissionId,
    );
    if (checkPermission)
      throw new BadRequestException('Permission already exists in this role');

    const findPermission = await this.permissionRepository.findOne({
      _id: permissionId,
    });
    if (!findPermission)
      throw new ConflictException("Permission doesn't exists");

    await this.roleRepository.update(id, {
      $addToSet: { permissions: permissionId },
    });
    return { message: 'Permission added sucessfully' };
  }

  async removePermission(
    id: string,
    permissionId: string,
  ): Promise<MessageResponseDto> {
    const findRole = await this.roleRepository.findOne({
      _id: id,
    });
    if (!findRole) throw new ConflictException("Role doesn't exists");

    const checkPermission = findRole.permissions.find(
      (permission: string) => permission === permissionId,
    );
    if (!checkPermission)
      throw new BadRequestException("There's no such permission in this role");

    if (findRole.permissions.length <= 1)
      throw new BadRequestException('A role must have at least one permission');

    await this.roleRepository.update(id, {
      $pull: { permissions: permissionId },
    });
    return { message: 'Permission removed sucessfully' };
  }

  async delete(id: string): Promise<MessageResponseDto> {
    const findRole = await this.roleRepository.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!findRole) throw new NotFoundException('Role not found');

    await this.roleRepository.delete(id);
    return { message: 'Role deleted sucessfully' };
  }
}
