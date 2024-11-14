import { Injectable } from '@nestjs/common';

import { UserRepository } from '../repository/user.repository';
import { HeadersUserDto, ResponseUserDto } from '../dto';
import { ListResponseDto } from 'src/dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async list(
    headers: HeadersUserDto,
  ): Promise<ListResponseDto<ResponseUserDto>> {
    const page = parseInt(headers['x-page'], 10) || 1;
    const limit = parseInt(headers['x-limit'], 10) || 10;

    const filterName = headers['x-filter-name'];
    const filterUserName = headers['x-filter-username'];
    const filterEmail = headers['x-filter-email'];

    const filters: Record<string, RegExp> = { deletedAt: null };
    if (filterName) filters['name'] = new RegExp(filterName, 'i');
    if (filterUserName) filters['username'] = new RegExp(filterUserName, 'i');
    if (filterEmail) filters['email'] = new RegExp(filterEmail, 'i');

    const list = await this.userRepository.find(filters, page, limit);
    const count = await this.userRepository.count(filters);

    return { count, list };
  }
}
