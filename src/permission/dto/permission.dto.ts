import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class PermissionDto {
  @IsString({ message: 'Permission name is string' })
  @IsNotEmpty({ message: 'Permission name is required' })
  @MinLength(3, {
    message: 'Permission name must be at least 3 characters long',
  })
  @MaxLength(20, { message: 'Permission name cannot exceed 20 characters' })
  name: string;

  @IsString({ message: 'Permission name is string' })
  @IsNotEmpty({ message: 'Description is required' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(100, { message: 'Description cannot exceed 100 characters' })
  description: string;
}
