import { SetMetadata } from '@nestjs/common';

/**
 * Декоратор для указания допустимых ролей на handler или controller (используется RolesGuard).
 * @param roles — список имён ролей
 * @returns декоратор метаданных
 */
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
