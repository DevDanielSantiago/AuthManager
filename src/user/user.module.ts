import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { UserService } from './service/user.service';
import { UserController } from './controller/user.controller';

import { User, UserSchema } from './schema/user.schema';

import { UserRepository, EmailChangeRequestRepository } from './repository';

import {
  EmailChangeRequest,
  EmailChangeRequestSchema,
} from './schema/EmailChangeRequest.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: EmailChangeRequest.name, schema: EmailChangeRequestSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule], // Importa o ConfigModule para o MailerModule
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST'),
          port: configService.get<number>('SMTP_PORT'),
          secure: configService.get<boolean>('SMTP_SECURE'),
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.get<string>('SMTP_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [UserService, UserRepository, EmailChangeRequestRepository],
  controllers: [UserController],
})
export class UserModule {}
