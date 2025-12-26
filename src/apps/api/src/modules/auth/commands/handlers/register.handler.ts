import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../impl/register.command';
import { UserService } from '../../services/user.service';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly usersRepo: UserService) {}

  async execute(command: RegisterCommand) {
    const existingUser = await this.usersRepo.findByEmail(command.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    const user = await this.usersRepo.create(command.email, command.password, command.roles);
    return { id: user.id, email: user.email, roles: user.roles };
  }
}
