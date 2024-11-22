import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';

export class ValidateDto {
  @IsString()
  @IsNotEmpty({ message: 'Auth token is required' })
  token: string;

  @IsArray({ message: 'Permissions must be an array' })
  @ArrayNotEmpty({
    message: 'Permissions cannot be an empty array',
  })
  @ArrayUnique({ message: 'Permissions must be unique' })
  @IsString({
    each: true,
    message: 'Each permission must be a string',
  })
  @Type(() => String)
  permissions: string[];
}
