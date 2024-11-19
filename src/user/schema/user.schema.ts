import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { v4 as uuidv4 } from 'uuid';

@Schema()
export class User extends Document {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({
    type: String,
    required: [true, 'User name is required'],
    trim: true,
    minlength: [3, 'User name must be at least 3 characters long'],
    maxLength: [40, 'User name cannot exceed 40 characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'User username is required'],
    unique: true,
    trim: true,
    minlength: [5, 'User username must be at least 5 characters long'],
    maxLength: [20, 'User username cannot exceed 20 characters'],
    match: /^[a-zA-Z0-9.]$/,
  })
  username: string;

  @Prop({
    type: String,
    required: [true, 'User email is required'],
    unique: true,
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'User password is required'],
  })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) this.createdAt = now;

  next();
});

UserSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

UserSchema.index({ name: 1 });
