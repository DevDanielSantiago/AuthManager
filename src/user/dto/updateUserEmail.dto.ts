import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserEmailDto {
  @IsEmail({}, { message: 'User email must be a valid email address' })
  @IsNotEmpty({ message: 'User email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'User password is required' })
  password: string;
}
