/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, RootFilterQuery, UpdateQuery } from 'mongoose';

import { User } from 'src/modules/user/schema/user.schema';
import { CreateUserDto, ResponseUserDto } from 'src/modules/user/dto';
import { QueryManipulator } from 'src/common/interfaces';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<User>,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    const User = new this.UserModel(data);
    return User.save();
  }

  async update(
    id: string,
    data: UpdateQuery<User>,
  ): Promise<ResponseUserDto | undefined> {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.UserModel.findByIdAndUpdate(id, data, options).exec();
  }

  async delete(id: string): Promise<ResponseUserDto | undefined> {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.UserModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      options,
    ).exec();
  }

  async findOne<T = ResponseUserDto>(
    filterQuery: RootFilterQuery<User>,
    manipulateQuery?: QueryManipulator,
  ): Promise<T | undefined> {
    let query = this.UserModel.findOne(filterQuery);
    if (manipulateQuery) query = manipulateQuery(query);

    const result = await query.exec();
    return result as unknown as T | undefined;
  }

  async find(
    filter: Record<string, RegExp>,
    page: number,
    limit: number,
  ): Promise<ResponseUserDto[]> {
    const skip = (page - 1) * limit;
    return this.UserModel.find(
      filter,
      '-password -__v -createdAt -updatedAt -deletedAt',
    )
      .populate({
        path: 'role',
        select: '-permissions -__v -createdAt -updatedAt -deletedAt',
      })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async count(filter: Record<string, RegExp>): Promise<number> {
    return this.UserModel.countDocuments(filter).exec();
  }
}
