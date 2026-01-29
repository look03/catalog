import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from '../impl/refresh.command';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { Tokens } from '../../types/auth.types';
import { JWT } from '../../constants/jwt.constants';
import { CryptoService } from '../../services/crypto.service';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly cryptoService: CryptoService,
  ) {}

  async execute(command: RefreshCommand): Promise<Tokens> {
    const { payload, session } = await this.refreshTokenService.validateSession(command.sessionId);

    // если refresh_token истечёт через сутки — обновляем (rotation)
    if (payload.exp && this.refreshTokenService.shouldRotateRefresh(payload.exp)) {
      await this.refreshTokenService.rotateRefreshSession(command.sessionId, payload, session);
    }

    const accessToken = this.jwtService.sign(
      {
        sub: payload.sub,
        roles: payload.roles,
        sid: command.sessionId,
      },
      {
        expiresIn: JWT.ACCESS_TOKEN_EXPIRES_IN,
      },
    );

    return {
      accessToken: this.cryptoService.encrypt(accessToken),
      sessionId: command.sessionId,
    };
  }
}
