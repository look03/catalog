import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from '../impl/refresh.command';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Tokens } from '../../types/auth.types';
import { randomUUID } from 'crypto';
import { JwtTokenService } from '../../services/jwt-token.service';
import { JWT } from '../../constants/jwt.constants';
import { getDetailsErrorUtil } from '../../../../common/utils/error.utils';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RefreshCommand): Promise<Tokens> {
    const payload = await this.refreshTokenService.validateSession(command.sessionId);

    const tokenData = {
      sub: payload.sub,
      email: payload.email,
      roles: payload.roles,
    };

    const accessToken = this.jwtService.sign(tokenData, {
      expiresIn: JWT.ACCESS_TOKEN_EXPIRES_IN,
    });
    const jti = randomUUID();
    const newRefreshToken = this.jwtTokenService.createJwtRefreshToken(tokenData, {
      sid: command.sessionId,
      jti,
    });

    await this.refreshTokenService.updateSessionToken(command.sessionId, newRefreshToken, jti);

    return {
      accessToken,
      sessionId: command.sessionId,
    };
  }
}
