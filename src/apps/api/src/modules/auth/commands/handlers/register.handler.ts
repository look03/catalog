import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from '../impl/register.command';
import { UserService } from '../../services/user.service';
import { ResponseCreateUser } from '../../types/auth.types';
import { InternalServerErrorException } from '@nestjs/common';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(private readonly usersRepo: UserService) {}

  async execute(command: RegisterCommand): Promise<ResponseCreateUser> {
    const existingUser = await this.usersRepo.findByEmail(command.email);
    if (existingUser) {
      throw new InternalServerErrorException('User already exists');
    }

    return this.usersRepo.create(command.email, command.password, command.roles || []);
  }
}
