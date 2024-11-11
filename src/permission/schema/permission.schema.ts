import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Permission extends Document {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({
    type: String,
    required: [true, 'Permission name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Permission name must be at least 3 characters long'],
    maxLength: [20, 'Permission name cannot exceed 20 characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxLength: [100, 'Description cannot exceed 100 characters'],
  })
  description: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

PermissionSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) this.createdAt = now;

  next();
});

PermissionSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});

PermissionSchema.index({ name: 1 });
