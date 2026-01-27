import { Injectable } from '@nestjs/common';
import { JwtPayload, JwtSessions } from '../types/auth.types';
import { JwtService } from '@nestjs/jwt';

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
      { expiresIn: '7d' },
    );
  }
}
