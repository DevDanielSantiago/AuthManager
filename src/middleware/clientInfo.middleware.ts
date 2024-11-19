import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ClientInfoMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const clientIp =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    req['clientInfo'] = { clientIp, userAgent };

    next();
  }
}
