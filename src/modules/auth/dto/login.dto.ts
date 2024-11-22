import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Auth method is required' })
  method: string; // E-mail or Username

  @IsString()
  @IsNotEmpty({ message: 'Auth password is required' })
  password: string;
}
