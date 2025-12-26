import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from '../entities/roles.entity';
import { ResponseCreateUser, UserByEmail } from '../types/auth.types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,

    @InjectRepository(Role)
    private readonly repoRole: Repository<Role>,
  ) {}

  async getUserRoleIdByName(name: string): Promise<number | undefined> {
    const response = await this.repoRole.findOneBy({ name });

    return response?.id;
  }

  async create(email: string, password: string, roleIds: number[]): Promise<ResponseCreateUser> {
    const userRoleId = await this.getUserRoleIdByName('user');
    if (!roleIds.length && userRoleId) {
      roleIds.push(userRoleId);
    }

    const roles = await this.repoRole.findBy({
      id: In(roleIds),
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.repo.create({
      email,
      passwordHash,
      roles,
    });

    const resUser = await this.repo.save(user);
    return {
      userId: resUser.id,
      email: resUser.email,
    };
  }

  async findByEmail(email: string): Promise<UserByEmail | null> {
    const user = await this.repo.findOne({
      where: { email },
      relations: ['roles'],
    });

    if (!user) {
      return null;
    }

    return {
      userId: user.id,
      email: user.email,
      roles: user.roles.map((el) => el.name),
      passwordHash: user.passwordHash,
    };
  }

  async validatePassword(passwordHash: string, password: string): Promise<boolean> {
    return bcrypt.compare(password, passwordHash);
  }
}
