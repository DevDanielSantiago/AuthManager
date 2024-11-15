import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, RootFilterQuery } from 'mongoose';

import { PasswordResetRequest } from 'src/user/schema/passwordResetRequest.schema';
import {
  PasswordResetRequestDto,
  ResponsePasswordResetRequestDto,
} from 'src/User/dto';

@Injectable()
export class PasswordResetRequestRepository {
  constructor(
    @InjectModel(PasswordResetRequest.name)
    private readonly EmailChangeRequestModel: Model<PasswordResetRequest>,
  ) {}

  async create(data: PasswordResetRequestDto): Promise<PasswordResetRequest> {
    const Request = new this.EmailChangeRequestModel(data);
    return Request.save();
  }

  async delete(id: string): Promise<DeleteResult> {
    return this.EmailChangeRequestModel.deleteOne({
      _id: id,
    }).exec();
  }

  async findOne(
    filterQuery: RootFilterQuery<PasswordResetRequest>,
  ): Promise<ResponsePasswordResetRequestDto | undefined> {
    return this.EmailChangeRequestModel.findOne(filterQuery).exec();
  }
}
