import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailChangeRequestDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEmail({})
  @IsNotEmpty()
  newEmail: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsDate()
  @IsNotEmpty()
  expirationTime: Date;

  @IsString()
  @IsNotEmpty()
  clientIp: string;
}
