import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'User currentPassword is required' })
  currentPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'User newPassword is required' })
  @Length(8, 20, {
    message: 'User newPassword must be between 8 and 20 characters long',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]+$/,
    {
      message:
        'User newPassword must contain at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*())',
    },
  )
  newPassword: string;
}
