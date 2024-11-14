import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdateUserPasswordDto {
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
  currentPassword: string;

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
  newPassword: string;
}
