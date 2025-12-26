import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from '../impl/login.command';
import { UserService } from '../../services/user.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../../services/refresh-token.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async execute(command: LoginCommand) {
    const user = await this.userService.findByEmail(command.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = await this.userService.validatePassword(user, command.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.refreshTokenService.saveRefreshToken(user.id, refreshToken, 7 * 24 * 3600);

    return { accessToken, refreshToken };
  }
}
