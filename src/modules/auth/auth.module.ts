import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => ({
        privateKey: process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
        publicKey: process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n'),
        signOptions: {
          algorithm: 'RS256',
          expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        },
      }),
    }),
    UserModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
