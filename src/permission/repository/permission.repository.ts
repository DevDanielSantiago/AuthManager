import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, RootFilterQuery } from 'mongoose';

import { Permission } from 'src/permission/schema/permission.schema';
import { PermissionDto, ResponsePermissionDto } from 'src/permission/dto';

@Injectable()
export class PermissionRepository {
  constructor(
    @InjectModel(Permission.name)
    private readonly permissionModel: Model<Permission>,
  ) {}

  async create(data: PermissionDto): Promise<Permission> {
    const permission = new this.permissionModel(data);
    return permission.save();
  }

  async update(
    id: string,
    data: PermissionDto,
  ): Promise<ResponsePermissionDto | undefined> {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.permissionModel.findByIdAndUpdate(id, data, options).exec();
  }

  async delete(id: string) {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.permissionModel
      .findByIdAndUpdate(id, { deletedAt: new Date() }, options)
      .exec();
  }

  async findOne(
    filterQuery: RootFilterQuery<Permission>,
  ): Promise<ResponsePermissionDto | undefined> {
    return this.permissionModel.findOne(filterQuery).exec();
  }

  async find(
    filter: Record<string, RegExp>,
    page: number,
    limit: number,
  ): Promise<ResponsePermissionDto[]> {
    const skip = (page - 1) * limit;
    return this.permissionModel
      .find(filter, '-__v -createdAt -updatedAt -deletedAt')
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async count(filter: Record<string, RegExp>): Promise<number> {
    return this.permissionModel.countDocuments(filter).exec();
  }
}
