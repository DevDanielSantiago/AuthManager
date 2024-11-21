import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class EmailChangeRequest extends Document {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  })
  newEmail: string;

  @Prop({ type: String, required: true, default: uuidv4 })
  token: string;

  @Prop({ type: Date, required: true })
  expirationTime: Date;

  @Prop({ type: String, required: true })
  clientIp: string;

  @Prop({ type: String, default: null })
  blockIp?: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ type: Date, default: null })
  deletedAt?: Date;
}

export const EmailChangeRequestSchema =
  SchemaFactory.createForClass(EmailChangeRequest);

EmailChangeRequestSchema.pre('save', function (next) {
  const now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) this.createdAt = now;

  next();
});

EmailChangeRequestSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: new Date() });
});
