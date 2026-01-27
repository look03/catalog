import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from '../impl/refresh.command';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Tokens } from '../../types/auth.types';
import { randomUUID } from 'crypto';
import { JwtTokenService } from '../../services/jwt-token.service';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: RefreshCommand): Promise<Tokens> {
    const payload = await this.refreshTokenService.validateSession(command.sessionId);

    try {
      const tokenData = {
        sub: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };

      const accessToken = this.jwtService.sign(tokenData, { expiresIn: '15m' });
      const jti = randomUUID();
      const newRefreshToken = this.jwtTokenService.createJwtRefreshToken(tokenData, {
        sid: command.sessionId,
        jti,
      });

      await this.refreshTokenService.updateSessionToken(
        command.sessionId,
        newRefreshToken,
        jti,
        7 * 24 * 3600,
      );

      return {
        accessToken,
        sessionId: command.sessionId,
      };
    } catch {
      throw new InternalServerErrorException('Invalid refresh token');
    }
  }
}
