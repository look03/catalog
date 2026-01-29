import {
  Body,
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
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
import { DecryptJwtGuard } from './infrastructure/decript.guard';
@Controller('auth/')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  /**
   * Регистрация нового пользователя по email, паролю и ролям.
   * @param body — DTO с email, паролем и опциональными ролями
   * @returns данные созданного пользователя
   */
  @Post('register/')
  async register(@Body() body: RegisterDto): Promise<ResponseCreateUser> {
    return this.commandBus.execute(
      new RegisterCommand(body.email, body.password, body.roles || [2]),
    );
  }

  /**
   * Вход по email и паролю, возвращает зашифрованный access-токен и sessionId.
   * @param body — DTO с email и паролем
   * @returns access-токен и sessionId
   */
  @Post('login/')
  async login(@Body() body: LoginDto): Promise<Tokens> {
    return this.commandBus.execute(new LoginCommand(body.email, body.password));
  }

  /**
   * Обновление access-токена по sessionId из cookie.
   * @param req — запрос с cookie sessionId
   * @returns новый access-токен и sessionId
   */
  @Post('refresh/')
  async refresh(@Req() req: Request): Promise<Tokens> {
    const sessionId = req.cookies['sessionId'] as string;

    if (!sessionId) {
      throw new UnauthorizedException('SessionId missing or invalid');
    }

    return this.commandBus.execute(new RefreshCommand(sessionId));
  }

  /**
   * Выход: удаление сессии в Redis и очистка cookie sessionId. Требует JWT в заголовке.
   * @param req — запрос с cookie sessionId
   * @param res — ответ для очистки cookie
   */
  @UseGuards(DecryptJwtGuard, JwtGuard)
  @Post('logout/')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Выход пользователя (logout)' })
  @ApiResponse({ status: 200, description: 'Успешный выход, токены удалены' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const sessionId = req.cookies['sessionId'] as string;

    if (!sessionId) {
      throw new UnauthorizedException('SessionId missing or invalid');
    }

    await this.commandBus.execute(new LogoutCommand(sessionId));

    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
  }
}
