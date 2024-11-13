import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateRoleDto {
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
}
