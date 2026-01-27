import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from '../impl/refresh.command';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtPayload, Tokens } from '../../types/auth.types';
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
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify<JwtPayload>(command.refreshToken);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (!payload.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.refreshTokenService.validateSession(command.sessionId, payload.jti);

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
        refreshToken: newRefreshToken,
        sessionId: command.sessionId,
      };
    } catch {
      throw new InternalServerErrorException('Invalid refresh token');
    }
  }
}
