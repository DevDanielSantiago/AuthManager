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
  tokenExpiration: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const EmailChangeRequestSchema =
  SchemaFactory.createForClass(EmailChangeRequest);

EmailChangeRequestSchema.pre('save', function (next) {
  const now = new Date();
  const expiration = new Date(Date.now() + 3600 * 1000);

  if (!this.createdAt) this.createdAt = now;
  if (!this.tokenExpiration) this.tokenExpiration = expiration;

  next();
});
