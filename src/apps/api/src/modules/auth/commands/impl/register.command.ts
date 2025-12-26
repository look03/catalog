import { UserRole } from '../../entities/user.entity';

export class RegisterCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly roles: UserRole[] = [UserRole.USER],
  ) {}
}
