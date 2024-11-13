import { ResponsePermissionDto } from 'src/permission/dto';

export interface ResponseRoleDto {
  _id: string;
  name: string;
  permissions: ResponsePermissionDto[] | string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
