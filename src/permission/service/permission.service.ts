import { Injectable } from '@nestjs/common';

import { ConflictException } from 'src/exception';

import { PermissionDto, MessageResponseDto } from 'src/permission/dto';
import { PermissionRepository } from 'src/permission/repository/permission.repository';

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepository: PermissionRepository) {}

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
}
