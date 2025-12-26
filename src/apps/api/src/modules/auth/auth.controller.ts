import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from './commands/impl/register.command';
import { LoginCommand } from './commands/impl/login.command';
import { RefreshCommand } from './commands/impl/refresh.command';
import { LogoutCommand } from './commands/impl/logout.command';
import { JwtGuard } from './infrastructure/jwt.guard';
import { UserRole } from './entities/user.entity';

@Controller('auth/')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register/')
  async register(@Body() body: { email: string; password: string; roles?: UserRole[] }) {
    return this.commandBus.execute(
      new RegisterCommand(body.email, body.password, body.roles || [UserRole.USER]),
    );
  }

  @Post('login/')
  async login(@Body() body: { email: string; password: string }) {
    return this.commandBus.execute(new LoginCommand(body.email, body.password));
  }

  @Post('refresh/')
  async refresh(@Body() body: { userId: string; refreshToken: string }) {
    return this.commandBus.execute(new RefreshCommand(body.userId, body.refreshToken));
  }

  @UseGuards(JwtGuard)
  @Post('logout/')
  async logout(@Req() req: any) {
    return this.commandBus.execute(new LogoutCommand(req.user.userId));
  }
}
