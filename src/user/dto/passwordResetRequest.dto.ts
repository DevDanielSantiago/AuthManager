import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class PasswordResetRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsDate()
  @IsNotEmpty()
  expirationTime: Date;
}
