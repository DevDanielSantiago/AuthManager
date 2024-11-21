import { ResponsePermissionDto } from 'src/modules/permission/dto';

export interface ResponseRoleDto {
  _id: string;
  name: string;
  permissions: ResponsePermissionDto[] | string[];
}
