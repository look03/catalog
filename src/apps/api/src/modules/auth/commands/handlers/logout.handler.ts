import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../impl/logout.command';
import { RefreshTokenService } from '../../services/refresh-token.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}

  async execute(command: LogoutCommand): Promise<void> {
    await this.refreshTokenService.deleteSession(command.sessionId);
  }
}
