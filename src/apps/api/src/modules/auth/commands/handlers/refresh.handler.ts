import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RefreshCommand } from '../impl/refresh.command';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { InternalServerErrorException } from '@nestjs/common';
import { JwtPayload, Tokens } from '../../types/auth.types';

@CommandHandler(RefreshCommand)
export class RefreshHandler implements ICommandHandler<RefreshCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(command: RefreshCommand): Promise<Tokens> {
    const savedToken = await this.refreshTokenService.getRefreshToken(command.userId);
    if (savedToken !== command.refreshToken) {
      throw new InternalServerErrorException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(command.refreshToken);

      const newPayload = { sub: payload.sub, email: payload.email, roles: payload.roles };
      const accessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const refreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      await this.refreshTokenService.saveRefreshToken(command.userId, refreshToken, 7 * 24 * 3600);

      return { userId: command.userId, accessToken, refreshToken };
    } catch {
      throw new InternalServerErrorException('Invalid refresh token');
    }
  }
}
