import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from './commands/impl/register.command';
import { LoginCommand } from './commands/impl/login.command';
import { RefreshCommand } from './commands/impl/refresh.command';
import { LogoutCommand } from './commands/impl/logout.command';
import { JwtGuard } from './infrastructure/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import type { RequestWithUser, ResponseCreateUser, Tokens } from './types/auth.types';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth/')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register/')
  async register(@Body() body: RegisterDto): Promise<ResponseCreateUser> {
    return this.commandBus.execute(
      new RegisterCommand(body.email, body.password, body.roles || [2]),
    );
  }

  @Post('login/')
  async login(@Body() body: LoginDto): Promise<Tokens> {
    return this.commandBus.execute(new LoginCommand(body.email, body.password));
  }

  @Post('refresh/')
  async refresh(@Body() body: RefreshDto): Promise<Tokens> {
    return this.commandBus.execute(new RefreshCommand(body.userId, body.refreshToken));
  }

  @UseGuards(JwtGuard)
  @Post('logout/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход пользователя (logout)' })
  @ApiResponse({ status: 200, description: 'Успешный выход, токены удалены' })
  async logout(@Req() req: RequestWithUser): Promise<void> {
    return this.commandBus.execute(new LogoutCommand(req.user.userId));
  }
}
