import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { CryptoService } from '../services/crypto.service';
import { Context } from '../types/auth.types';

@Injectable()
export class DecryptJwtGuard implements CanActivate {
  constructor(private readonly cryptoService: CryptoService) {}

  /**
   * Расшифровывает Bearer-токен из заголовка Authorization и подставляет расшифрованный JWT в заголовок.
   * @param context — контекст выполнения (запрос)
   * @returns true при успешной расшифровке
   */
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Context>();

    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const [type, encryptedToken] = authHeader.split(' ');
    if (type !== 'Bearer' || !encryptedToken) {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    try {
      const decryptedToken = this.cryptoService.decrypt(encryptedToken);
      // Заменяем заголовок на расшифрованный JWT
      request.headers['authorization'] = `Bearer ${decryptedToken}`;
      return true;
    } catch {
      throw new UnauthorizedException('Failed to decrypt token');
    }
  }
}
