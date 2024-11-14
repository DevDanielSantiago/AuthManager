import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DeleteResult, Model, RootFilterQuery } from 'mongoose';

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

  async delete(id: string): Promise<DeleteResult> {
    return this.EmailChangeRequestModel.deleteOne({
      _id: id,
    }).exec();
  }

  async findOne(
    filterQuery: RootFilterQuery<EmailChangeRequest>,
  ): Promise<ResponseEmailChangeRequestDto | undefined> {
    return this.EmailChangeRequestModel.findOne(filterQuery).exec();
  }
}
