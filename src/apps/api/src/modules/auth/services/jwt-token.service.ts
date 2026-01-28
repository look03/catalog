import { Injectable } from '@nestjs/common';
import { JwtPayload, JwtSessions } from '../types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { JWT } from '../constants/jwt.constants';

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

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
