import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtUser } from '../types/auth.types';
import { Logger } from '@nestjs/common';
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  private logger = new Logger('JwtGuard');
  handleRequest<TUser = JwtUser>(err: unknown, user: TUser | false, info: unknown): TUser {
    if (err || !user) {
      this.logger.error(err ?? info);
      throw err instanceof Error ? err : new UnauthorizedException();
    }

    return user;
  }
}
