import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';

import mongoose from 'mongoose';

@Injectable()
export class TransactionManager {
  constructor(
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async execute<T>(
    exec: (session: mongoose.ClientSession) => Promise<T>,
  ): Promise<T> {
    const session = await this.connection.startSession();
    let result: T;

    try {
      session.startTransaction();
      result = await exec(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return result;
  }
}
