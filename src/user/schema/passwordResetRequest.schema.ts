import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class PasswordResetRequest extends Document {
  @Prop({ type: String, default: uuidv4 })
  _id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({ type: String, required: true, default: uuidv4 })
  resetToken: string;

  @Prop({ type: Date, required: true })
  tokenExpiration: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const PasswordResetRequestSchema =
  SchemaFactory.createForClass(PasswordResetRequest);
