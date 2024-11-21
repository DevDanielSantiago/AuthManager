import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import {
  ISendMailOptions,
  MailerService as NestMailerService,
} from '@nestjs-modules/mailer';
import { BadRequestException } from 'src/common/exception';
import { UpdateEmailRequestDTO } from 'src/common/dto';

@Injectable()
export class MailerService {
  constructor(private readonly nestMailerService: NestMailerService) {}

  private readonly logger = new Logger(MailerService.name);

  private async sendMail(updateEmailRequest: ISendMailOptions) {
    return this.nestMailerService.sendMail(updateEmailRequest);
  }

  async sendUpdateEmailRequest(updateEmailRequest: UpdateEmailRequestDTO) {
    const { currentUser, updateUser } = updateEmailRequest;
    try {
      const companyName = process.env.COMPANY_NAME;
      const baseUrl = `https://${process.env.SYSTEM_HOST}/email-change`;
      const confirmUrl = `${baseUrl}/confirm/${updateEmailRequest.token}`;
      const ignoreUrl = `${baseUrl}/ignore/${updateEmailRequest.token}`;

      const requestDate = new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      this.logger.log(`Sending an email to: ${currentUser.email}`);
      await this.sendMail({
        to: currentUser.email,
        subject: `${process.env.SYSTEM_NAME} - Alteração de e-mail`,
        template: 'requestChangeEmail',
        context: {
          name: currentUser.name,
          newEmail: updateUser.email,
          currentEmail: currentUser.email,
          confirmUrl,
          ignoreUrl,
          requestDate,
          companyName,
          currentYear: new Date().getFullYear(),
          expirationTime: 1,
          device: updateEmailRequest.device,
          location: updateEmailRequest.location,
        },
      });
      this.logger.log(`Email sended to: ${currentUser.email}`);
      return;
    } catch {
      this.logger.error(`Failure to send email to: ${currentUser.email}`);
      throw new BadRequestException('Failure to send email');
    }
  }
}
