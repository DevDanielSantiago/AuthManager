import { Injectable } from '@nestjs/common';

import { ConflictException, NotFoundException } from 'src/exception';

import { ListResponseDto, MessageResponseDto } from 'src/dto';
import {
  PermissionDto,
  ResponsePermissionDto,
  HeadersPermissionDto,
} from 'src/permission/dto';

import { PermissionRepository } from 'src/permission/repository/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

  async list(
    headers: HeadersPermissionDto,
  ): Promise<ListResponseDto<ResponsePermissionDto>> {
    const page = parseInt(headers['x-page'], 10) || 1;
    const limit = parseInt(headers['x-limit'], 10) || 10;

    const filterName = headers['x-filter-name'];

    const filters: Record<string, RegExp> = { deletedAt: null };
    if (filterName) filters['name'] = new RegExp(filterName, 'i');

    const list = await this.permissionRepository.find(filters, page, limit);
    const count = await this.permissionRepository.count(filters);

    return { count, list };
  }

  async create(permission: PermissionDto): Promise<MessageResponseDto> {
    const findPermission = await this.permissionRepository.findOne({
      name: permission.name,
      deletedAt: null,
    });

    if (findPermission)
      throw new ConflictException('Permission already exists');

    await this.permissionRepository.create(permission);
    return { message: 'Permission created sucessfully' };
  }

  async update(
    id: string,
    permission: PermissionDto,
  ): Promise<MessageResponseDto> {
    const findPermission = await this.permissionRepository.findOne({
      name: permission.name,
      deletedAt: null,
      _id: { $ne: id },
    });

    if (findPermission)
      throw new ConflictException('Permission already exists');

    await this.permissionRepository.update(id, permission);
    return { message: 'Permission updated sucessfully' };
  }

  async delete(id: string): Promise<MessageResponseDto> {
    const findPermission = await this.permissionRepository.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!findPermission) throw new NotFoundException('Permission not found');

    await this.permissionRepository.delete(id);
    return { message: 'Permission deleted sucessfully' };
  }
}
