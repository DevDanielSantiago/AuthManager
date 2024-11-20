import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from './service/user.service';
import { GeoLocationService } from './service/geolocation.service';
import { UserController } from './controller/user.controller';

import { User, UserSchema } from './schema/user.schema';

import {
  UserRepository,
  EmailChangeRequestRepository,
  PasswordResetRequestRepository,
} from './repository';

import {
  EmailChangeRequest,
  EmailChangeRequestSchema,
} from './schema/EmailChangeRequest.schema';
import {
  PasswordResetRequest,
  PasswordResetRequestSchema,
} from './schema/passwordResetRequest.schema';

import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailChangeRequest.name, schema: EmailChangeRequestSchema },
      { name: PasswordResetRequest.name, schema: PasswordResetRequestSchema },
    ]),
    MailerModule,
  ],
  providers: [
    UserService,
    GeoLocationService,
    UserRepository,
    EmailChangeRequestRepository,
    PasswordResetRequestRepository,
  ],
  controllers: [UserController],
})
export class UserModule {}
