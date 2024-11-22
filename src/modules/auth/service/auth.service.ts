import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ConflictException } from 'src/common/exception';

import * as bcrypt from 'bcrypt';

import { UserRepository } from 'src/modules/user/repository';
import { LoginDto } from '../dto/login.dto';
import { ResponseUserPermissionsDto } from 'src/modules/User/dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUsernameAndEmail(method: string) {
    const findUser =
      await this.userRepository.findOne<ResponseUserPermissionsDto>(
        {
          deletedAt: null,
          $or: [{ email: method }, { username: method }],
        },
        (query) =>
          query.populate({ path: 'role', populate: { path: 'permissions' } }),
      );
    if (!findUser) throw new ConflictException('Invalid credencials');

    return findUser;
  }

  private async validatePassword(password: string, encrypted: string) {
    const isValid = await bcrypt.compare(password, encrypted);
    if (!isValid) throw new BadRequestException('Invalid credencials');
  }

  async authentication(login: LoginDto) {
    const user = await this.validateUsernameAndEmail(login.method);

    await this.validatePassword(login.password, user.password);

    const payload = {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role.name,
      permissions: user.role.permissions.map((permission) => permission.name),
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
