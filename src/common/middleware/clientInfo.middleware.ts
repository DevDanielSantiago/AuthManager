import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClientInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const clientIp = ip.startsWith('::ffff:') ? ip.split('::ffff:')[1] : ip;

    req['clientInfo'] = { clientIp, userAgent };

    next();
  }
}
