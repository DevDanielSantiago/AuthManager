/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Document, Query } from 'mongoose';

import { User } from 'src/modules/user/schema/user.schema';

type UserDocument = Document<unknown, {}, User> &
  User &
  Required<{ _id: string }> & { __v: number };

export type QueryManipulator = (
  query: Query<UserDocument | null, UserDocument>,
) => Query<UserDocument | null, UserDocument>;
