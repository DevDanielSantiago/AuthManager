import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, RootFilterQuery, UpdateQuery } from 'mongoose';

import { Role } from 'src/role/schema/role.schema';
import { CreateRoleDto, ResponseRoleDto } from 'src/Role/dto';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectModel(Role.name)
    private readonly RoleModel: Model<Role>,
  ) {}

  async create(data: CreateRoleDto): Promise<Role> {
    const Role = new this.RoleModel(data);
    return Role.save();
  }

  async update(
    id: string,
    data: UpdateQuery<Role>,
  ): Promise<ResponseRoleDto | undefined> {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.RoleModel.findByIdAndUpdate(id, data, options).exec();
  }

  async delete(id: string): Promise<ResponseRoleDto | undefined> {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.RoleModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      options,
    ).exec();
  }

  async findOne(
    filterQuery: RootFilterQuery<Role>,
  ): Promise<ResponseRoleDto | undefined> {
    return this.RoleModel.findOne(filterQuery).exec();
  }

  async find(
    filter: Record<string, RegExp>,
    page: number,
    limit: number,
  ): Promise<ResponseRoleDto[]> {
    const skip = (page - 1) * limit;
    return this.RoleModel.find(filter, '-__v -createdAt -updatedAt -deletedAt')
      .populate({
        path: 'permissions',
        select: '-__v -createdAt -updatedAt -deletedAt',
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async count(filter: Record<string, RegExp>): Promise<number> {
    return this.RoleModel.countDocuments(filter).exec();
  }
}
