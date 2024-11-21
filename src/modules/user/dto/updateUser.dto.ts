import { IsString, IsNotEmpty, Length, Matches } from 'class-validator';

export class UpdateUserDto {
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
}
