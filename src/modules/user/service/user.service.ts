import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

import {
  UserRepository,
  EmailChangeRequestRepository,
  PasswordResetRequestRepository,
} from '../repository';
import { GeoLocationService } from '.';
import {
  CreateUserDto,
  HeadersUserDto,
  ResponseEmailChangeRequestDto,
  ResponseUserDto,
  UpdateUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
} from '../dto';
import {
  ClientInfoDto,
  ListResponseDto,
  MessageResponseDto,
} from 'src/common/dto';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from 'src/common/exception';

import { MailerService } from 'src/modules/mailer/service/mailer.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailChangeRequestRepository: EmailChangeRequestRepository,
    private readonly passwordResetRequestRepository: PasswordResetRequestRepository,
    private readonly mailerService: MailerService,
    private readonly geolocationService: GeoLocationService,
  ) {}

  private async findAndValidateUserById(id: string): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({
      _id: id,
      deletedAt: null,
    });
    if (!findUser) throw new ConflictException("User doesn't exists");

    return findUser;
  }

  private async validateUsernameAndEmail(username: string, email: string) {
    const findUser = await this.userRepository.findOne({
      deletedAt: null,
      $or: [{ username: username, email: email }],
    });
    if (findUser)
      throw new ConflictException('Username or email already exists');
  }

  private async validatePassword(password: string, encrypted: string) {
    const isValid = await bcrypt.compare(password, encrypted);
    if (!isValid)
      throw new BadRequestException('Current password is incorrect');
  }

  private async validateClientIp(id: string, clientIp: string) {
    const checkIpBlocked = await this.emailChangeRequestRepository.findOne({
      userId: id,
      blockIp: clientIp,
    });
    if (checkIpBlocked) throw new UnauthorizedException('Unauthorized request');
  }

  private async findAndvalidateToken(
    token: string,
  ): Promise<ResponseEmailChangeRequestDto> {
    const findRequest = await this.emailChangeRequestRepository.findOne({
      token,
      deletedAt: null,
    });
    if (!findRequest) throw new ConflictException("Token doesn't exists");

    return findRequest;
  }

  private async validateUsername(notId: string, username: string) {
    const findUsername = await this.userRepository.findOne({
      deletedAt: null,
      username: username,
      _id: { $ne: notId },
    });
    if (findUsername) throw new ConflictException('Username already exists');
  }

  private validateExpirationTime(expirationTime: Date) {
    const inputDate = new Date(expirationTime);
    const now = new Date();

    const diffInMilliseconds = now.getTime() - inputDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

    if (diffInHours > 1) throw new UnauthorizedException('Expired token');
  }

  private generateTokenAndExpirationTime() {
    const token = uuid();
    const expirationTime = new Date(Date.now() + 60 * 60 * 1000);

    return { token, expirationTime };
  }

  private async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  private async handleGeoLocation(clientIp: string) {
    const geoLocation = await this.geolocationService.getGeoLocation(clientIp);

    if (!geoLocation) return undefined;
    return `${geoLocation.city} / ${geoLocation.region_name} - ${geoLocation.country_name}`;
  }

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
    await this.validateUsernameAndEmail(user.username, user.email);
    user.password = await this.encryptPassword(user.password);

    await this.userRepository.create(user);
    return { message: 'User created sucessfully' };
  }

  async update(id: string, user: UpdateUserDto): Promise<MessageResponseDto> {
    await this.findAndValidateUserById(id);
    await this.validateUsername(user.username, id);

    await this.userRepository.update(id, user);
    return { message: 'User updated sucessfully' };
  }

  async updatePassword(
    id: string,
    updateUser: UpdateUserPasswordDto,
  ): Promise<MessageResponseDto> {
    const user = await this.findAndValidateUserById(id);

    await this.validatePassword(updateUser.currentPassword, user.password);
    const hashedPassword = await this.encryptPassword(updateUser.newPassword);

    await this.userRepository.update(id, { password: hashedPassword });
    return { message: 'Password updated sucessfully' };
  }

  async updateEmail(
    id: string,
    updateUser: UpdateUserEmailDto,
    request: ClientInfoDto,
  ): Promise<MessageResponseDto> {
    const user = await this.findAndValidateUserById(id);
    await this.validatePassword(updateUser.password, user.password);

    const { clientIp, userAgent } = request.clientInfo;
    await this.validateClientIp(user._id, clientIp);

    const { token, expirationTime } = this.generateTokenAndExpirationTime();

    await this.emailChangeRequestRepository.create({
      userId: id,
      newEmail: updateUser.email,
      token: token,
      expirationTime: expirationTime,
      clientIp: clientIp,
    });

    const location = await this.handleGeoLocation(clientIp);
    await this.mailerService.sendUpdateEmailRequest({
      currentUser: user,
      updateUser: updateUser,
      device: userAgent,
      token: token,
      location: location,
    });

    return { message: 'Request created sucessfully' };
  }

  async confirmUpdateEmail(token: string) {
    const request = await this.findAndvalidateToken(token);

    this.validateExpirationTime(request.expirationTime);

    await this.userRepository.update(request.userId, {
      email: request.newEmail,
    });

    await this.emailChangeRequestRepository.delete(request._id);

    return { message: 'E-mail updated sucessfully' };
  }

  async ignoreUpdateEmail(token: string) {
    const request = await this.findAndvalidateToken(token);

    await this.emailChangeRequestRepository.update(request._id, {
      blockIp: request.clientIp,
      deletedAt: new Date(),
    });

    return { message: 'Client blocked sucessfully' };
  }
}
