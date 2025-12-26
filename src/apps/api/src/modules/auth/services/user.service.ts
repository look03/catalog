import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(
    email: string,
    password: string,
    roles: UserRole[] = [UserRole.USER],
  ): Promise<User> {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.repo.create({
      email,
      passwordHash,
      roles,
    });

    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.passwordHash);
  }
}
