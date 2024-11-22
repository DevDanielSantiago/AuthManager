import { ResponsePermissionDto } from 'src/modules/permission/dto';

export interface ResponseUserDto {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: {
    _id: string;
    name: string;
  };
}

export interface ResponseUserPermissionsDto {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: {
    _id: string;
    name: string;
    permissions: ResponsePermissionDto[];
  };
}
