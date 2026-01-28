import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from '../impl/refresh.command';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Tokens } from '../../types/auth.types';
import { randomUUID } from 'crypto';
import { JwtTokenService } from '../../services/jwt-token.service';
import { JWT } from '../../constants/jwt.constants';
import { CryptoService } from '../../services/crypto.service';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: RefreshCommand): Promise<Tokens> {
    const payload = await this.refreshTokenService.validateSession(command.sessionId);

    const tokenData = {
      sub: payload.sub,
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
      accessToken: this.cryptoService.encrypt(accessToken),
      sessionId: command.sessionId,
    };
  }
}
