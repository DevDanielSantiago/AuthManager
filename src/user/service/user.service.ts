import { Injectable } from '@nestjs/common';

import { UserRepository } from '../repository/user.repository';
import {
  CreateUserDto,
  HeadersUserDto,
  ResponseUserDto,
  UpdateUserDto,
} from '../dto';
import { ListResponseDto, MessageResponseDto } from 'src/dto';
import { ConflictException } from 'src/exception';

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

  async create(user: CreateUserDto): Promise<MessageResponseDto> {
    const findUser = await this.userRepository.findOne({
      deletedAt: null,
      $or: [{ username: user.username, email: user.email }],
    });
    if (findUser)
      throw new ConflictException('Username or email already exists');

    await this.userRepository.create(user);
    return { message: 'User created sucessfully' };
  }

  async update(id: string, user: UpdateUserDto): Promise<MessageResponseDto> {
    const findUser = await this.userRepository.findOne({ _id: id });
    if (!findUser) throw new ConflictException("User doesn't exists");

    const findCodeName = await this.userRepository.findOne({
      deletedAt: null,
      $or: [{ username: user.username }],
      _id: { $ne: id },
    });
    if (findCodeName) throw new ConflictException('Codename already exists');

    await this.userRepository.update(id, user);
    return { message: 'User updated sucessfully' };
  }
}
