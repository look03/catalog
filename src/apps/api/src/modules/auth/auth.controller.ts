import { Body, Controller, Post, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterCommand } from './commands/impl/register.command';
import { LoginCommand } from './commands/impl/login.command';
import { RefreshCommand } from './commands/impl/refresh.command';
import { LogoutCommand } from './commands/impl/logout.command';
import { JwtGuard } from './infrastructure/jwt.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResponseCreateUser, Tokens } from './types/auth.types';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';
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
  async refresh(@Req() req: Request): Promise<Tokens> {
    const sessionId = req.cookies['sessionId'] as string;

    if (!sessionId) {
      throw new UnauthorizedException('SessionId missing or invalid');
    }

    return this.commandBus.execute(new RefreshCommand(sessionId));
  }

  @UseGuards(JwtGuard)
  @Post('logout/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход пользователя (logout)' })
  @ApiResponse({ status: 200, description: 'Успешный выход, токены удалены' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const sessionId = req.cookies['sessionId'] as string;
    await this.commandBus.execute(new LogoutCommand(sessionId));

    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
  }
}
