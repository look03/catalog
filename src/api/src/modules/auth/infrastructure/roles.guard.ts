import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenException } from '@nestjs/common';
import { Context } from '../types/auth.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Проверяет, что у пользователя есть одна из ролей из декоратора @Roles; иначе ForbiddenException.
   * @param context — контекст выполнения (запрос)
   * @returns true при наличии роли
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles =
      this.reflector.get<string[]>('roles', context.getHandler()) ||
      this.reflector.get<string[]>('roles', context.getClass());

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Context>();

    const hasRole = requiredRoles.some((role) => user?.roles?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException('Access denied: insufficient permissions');
    }

    return hasRole;
  }
}
