import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Role name must be a string' })
  @IsNotEmpty({
    message: 'Role name is required',
  })
  @MinLength(3, {
    message: 'Role name must be at least 3 characters long',
  })
  @MaxLength(20, {
    message: 'Role name cannot exceed 20 characters',
  })
  name: string;

  @IsArray({ message: 'Permissions must be an array' })
  @ArrayNotEmpty({
    message: 'Permissions cannot be an empty array',
    groups: ['create'],
  })
  @ArrayUnique({ message: 'Permissions must be unique' })
  @IsString({
    each: true,
    message: 'Each permission must be a string',
    groups: ['create'],
  })
  @Type(() => String)
  permissions?: string[];
}
