import {
  IsString,
  IsEmail,
  Length,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'User name is required' })
  @Length(3, 40, {
    message: 'User name must be between 3 and 40 characters long',
  })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'User username is required' })
  @Length(5, 20, {
    message: 'User username must be between 5 and 20 characters long',
  })
  @Matches(/^[a-zA-Z0-9.]+$/, {
    message: 'User username can only contain letters, numbers, and dots (.)',
  })
  username: string;

  @IsEmail({}, { message: 'User email must be a valid email address' })
  @IsNotEmpty({ message: 'User email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'User password is required' })
  @Length(8, 20, {
    message: 'User password must be between 8 and 20 characters long',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]+$/,
    {
      message:
        'User password must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*())',
    },
  )
  password: string;
}
