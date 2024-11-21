import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RoleController } from './controller/role.controller';
import { RoleService } from './service/role.service';
import { Role, RoleSchema } from './schema/role.schema';
import { RoleRepository } from './repository/role.repository';
import { PermissionModule } from 'src/modules/permission/permission.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    PermissionModule,
  ],
  controllers: [RoleController],
  providers: [RoleService, RoleRepository],
})
export class RoleModule {}
