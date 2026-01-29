import { Injectable } from '@nestjs/common';
import { JwtPayload, JwtSessions } from '../types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { JWT } from '../constants/jwt.constants';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Создаёт JWT refresh-токен с payload, sid, jti и типом 'refresh'.
   * @param payload — данные для payload (sub, roles)
   * @param sessions — sid и jti
   * @returns подписанный JWT refresh-токен
   */
  createJwtRefreshToken(payload: JwtPayload, sessions: JwtSessions) {
    return this.jwtService.sign(
      {
        ...payload,
        ...sessions,
        type: 'refresh',
      },
      { expiresIn: JWT.REFRESH_TOKEN_EXPIRES_IN },
    );
  }
}
