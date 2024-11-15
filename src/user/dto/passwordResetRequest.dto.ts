import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  resetToken: string;

  @IsDate()
  @IsNotEmpty()
  tokenExpiration: Date;
}
