import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions, RootFilterQuery, UpdateQuery } from 'mongoose';

import { EmailChangeRequest } from 'src/user/schema/EmailChangeRequest.schema';
import {
  EmailChangeRequestDto,
  ResponseEmailChangeRequestDto,
} from 'src/User/dto';

@Injectable()
export class EmailChangeRequestRepository {
  constructor(
    @InjectModel(EmailChangeRequest.name)
    private readonly EmailChangeRequestModel: Model<EmailChangeRequest>,
  ) {}

  async create(data: EmailChangeRequestDto): Promise<EmailChangeRequest> {
    const Request = new this.EmailChangeRequestModel(data);
    return Request.save();
  }

  async update(
    id: string,
    data: UpdateQuery<EmailChangeRequest>,
  ): Promise<ResponseEmailChangeRequestDto | undefined> {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.EmailChangeRequestModel.findByIdAndUpdate(
      id,
      data,
      options,
    ).exec();
  }

  async delete(id: string): Promise<ResponseEmailChangeRequestDto | undefined> {
    const options: QueryOptions = { new: true, runValidators: true };
    return this.EmailChangeRequestModel.findByIdAndUpdate(
      id,
      { deletedAt: new Date() },
      options,
    ).exec();
  }

  async findOne(
    filterQuery: RootFilterQuery<EmailChangeRequest>,
  ): Promise<ResponseEmailChangeRequestDto | undefined> {
    return this.EmailChangeRequestModel.findOne(filterQuery).exec();
  }
}
