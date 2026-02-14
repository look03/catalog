import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../impl/logout.command';
import { RefreshTokenService } from '../../services/refresh-token.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  /**
   * Удаляет сессию из Redis по sessionId.
   * @param command — команда с sessionId
   */
  async execute(command: LogoutCommand): Promise<void> {
    await this.refreshTokenService.deleteSession(command.sessionId);
  }
}
