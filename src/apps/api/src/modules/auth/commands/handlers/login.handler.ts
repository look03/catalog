import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../impl/login.command';
import { UserService } from '../../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';
import { InternalServerErrorException } from '@nestjs/common';
import { Tokens } from '../../types/auth.types';
import { randomUUID } from 'crypto';
import { JwtTokenService } from '../../services/jwt-token.service';
import { JWT } from '../../constants/jwt.constants';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: LoginCommand): Promise<Tokens> {
    const user = await this.userService.findByEmail(command.email);

    if (!user) {
      throw new InternalServerErrorException('Invalid credentials');
    }
    const isPasswordValid = await this.userService.validatePassword(
      user.passwordHash,
      command.password,
    );

    if (!isPasswordValid) {
      throw new InternalServerErrorException('Invalid credentials');
    }

    const sessionId = randomUUID();
    const jti = randomUUID();
    const payload = { sub: user.userId, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: JWT.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = this.jwtTokenService.createJwtRefreshToken(payload, {
      sid: sessionId,
      jti,
    });

    await this.refreshTokenService.saveSession(sessionId, user.userId, refreshToken, jti);

    return { accessToken, sessionId };
  }
}
