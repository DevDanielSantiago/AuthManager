import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import {
  UserRepository,
  EmailChangeRequestRepository,
  PasswordResetRequestRepository,
} from '../repository';
import {
  CreateUserDto,
  HeadersUserDto,
  ResponseUserDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
} from '../dto';
import { ListResponseDto, MessageResponseDto } from 'src/dto';
import { BadRequestException, ConflictException } from 'src/exception';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailChangeRequestRepository: EmailChangeRequestRepository,
    private readonly passwordResetRequestRepository: PasswordResetRequestRepository,
    private readonly mailerService: MailerService,
  ) {}

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

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(user.password, salt);

    await this.userRepository.create(user);
    return { message: 'User created sucessfully' };
  }

  async update(id: string, user: UpdateUserDto): Promise<MessageResponseDto> {
    const findUser = await this.userRepository.findOne({ _id: id });
    if (!findUser) throw new ConflictException("User doesn't exists");

    const findCodeName = await this.userRepository.findOne({
      deletedAt: null,
      username: user.username,
      _id: { $ne: id },
    });
    if (findCodeName) throw new ConflictException('Codename already exists');

    await this.userRepository.update(id, user);
    return { message: 'User updated sucessfully' };
  }

  async updatePassword(
    id: string,
    user: UpdateUserPasswordDto,
  ): Promise<MessageResponseDto> {
    const findUser = await this.userRepository.findOne({ _id: id });
    if (!findUser) throw new ConflictException("User doesn't exists");

    const isPasswordValid = await bcrypt.compare(
      user.currentPassword,
      findUser.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException('Current password is incorrect');

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.newPassword, salt);

    await this.userRepository.update(id, { password: hashedPassword });
    return { message: 'Password updated sucessfully' };
  }

  async updateEmail(
    id: string,
    user: UpdateUserEmailDto,
    request: ClientInfoDto,
  ): Promise<MessageResponseDto> {
    const findUser = await this.userRepository.findOne({ _id: id });
    if (!findUser) throw new ConflictException("User doesn't exists");

    const isPasswordValid = await bcrypt.compare(
      user.password,
      findUser.password,
    );
    if (!isPasswordValid)
      throw new BadRequestException('Current password is incorrect');

    const token = uuid();
    const tokenExpiration = new Date(Date.now() + 3600 * 1000);

    const requestResult = await this.emailChangeRequestRepository.create({
      userId: id,
      newEmail: user.email,
      token,
      tokenExpiration,
    });

    await this.mailerService.sendMail({
      to: findUser.email,
      subject: 'Atualização de e-mail',
      text: `ID de recuperação: ${requestResult._id}`,
    });

    return { message: 'Request created sucessfully' };
  }

  async forgotPassword(email: string) {
    const findEmail = await this.userRepository.findOne({ email });
    if (!findEmail) throw new ConflictException("Email doesn't exists");

    const resetToken = uuid();
    const tokenExpiration = new Date(Date.now() + 3600 * 1000);

    await this.passwordResetRequestRepository.create({
      userId: findEmail._id,
      resetToken,
      tokenExpiration,
    });

    await this.mailerService.sendMail({
      to: findEmail.email,
      subject: 'Recuperação de senha',
      text: `ID de recuperação: ${findEmail._id}`,
    });

    return { message: 'E-mail sended sucessfully' };
  }

  async confirmUpdateEmail(token: string) {
    const findRequest = await this.emailChangeRequestRepository.findOne({
      token,
      deletedAt: null,
    });
    if (!findRequest) throw new ConflictException("Token doesn't exists");

    const inputDate = new Date(findRequest.tokenExpiration);
    const now = new Date();

    const diffInMilliseconds = now.getTime() - inputDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    if (diffInHours > 1) throw new UnauthorizedException('Expired token');

    await this.userRepository.update(findRequest.userId, {
      email: findRequest.newEmail,
    });

    await this.emailChangeRequestRepository.delete(findRequest._id);

    return { message: 'E-mail updated sucessfully' };
  }

  async ignoreUpdateEmail(token: string) {
    const findRequest = await this.emailChangeRequestRepository.findOne({
      token,
      deletedAt: null,
    });
    if (!findRequest) throw new ConflictException("Token doesn't exists");

    await this.emailChangeRequestRepository.update(findRequest._id, {
      blockIp: findRequest.clientIp,
      deletedAt: new Date(),
    });

    return { message: 'Client blocked sucessfully' };
  }
}
