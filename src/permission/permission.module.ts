import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PermissionController } from './controller/permission.controller';
import { PermissionService } from './service/permission.service';
import { Permission, PermissionSchema } from './schema/permission.schema';
import { PermissionRepository } from './repository/permission.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService, PermissionRepository],
  exports: [PermissionRepository],
})
export class PermissionModule {}
