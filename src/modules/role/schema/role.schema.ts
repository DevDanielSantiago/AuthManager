import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { v4 as uuidv4 } from 'uuid';

import { Permission } from 'src/modules/permission/schema/permission.schema';

@Schema()
export class Role extends Document {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Role name must be at least 3 characters long'],
    maxLength: [20, 'Role name cannot exceed 20 characters'],
  })
  name: string;

  @Prop({
    type: [String],
    ref: 'Permission',
  })
  permissions: Permission[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) this.createdAt = now;

  next();
});

RoleSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

RoleSchema.index({ name: 1 });
