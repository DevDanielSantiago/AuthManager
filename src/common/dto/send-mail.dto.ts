import { ResponseUserDto, UpdateUserEmailDto } from 'src/modules/User/dto';

export class UpdateEmailRequestDTO {
  currentUser: ResponseUserDto;
  updateUser: UpdateUserEmailDto;
  location: string | undefined;
  device: string | undefined;
  token: string;
}
