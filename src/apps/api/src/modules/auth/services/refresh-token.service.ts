import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { RefreshSession } from '../types/auth.types';

@Injectable()
export class RefreshTokenService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async saveSession(
    sessionId: string,
    userId: string,
    refreshToken: string,
    jti: string,
    expiresInSec: number,
  ): Promise<void> {
    const payload: RefreshSession = {
      userId,
      refreshToken,
      sid: sessionId,
      jti,
      createdAt: Date.now(),
    };

    await this.redisClient.set(
      `refresh_session:${sessionId}`,
      JSON.stringify(payload),
      'EX',
      expiresInSec,
    );
  }

  async getSession(sessionId: string): Promise<RefreshSession | null> {
    const data = await this.redisClient.get(`refresh_session:${sessionId}`);
    return data ? JSON.parse(data) : null;
  }

  async validateSession(sessionId: string, jti: string): Promise<void> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }
    console.log(session, '<<<<<<<<<<<<<< session');
    if (session.jti !== jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateSessionToken(
    sessionId: string,
    newRefreshToken: string,
    jti: string,
    expiresInSec: number,
  ): Promise<void> {
    const session = await this.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const updatedSession: RefreshSession = {
      ...session,
      jti,
      refreshToken: newRefreshToken,
    };

    await this.redisClient.set(
      `refresh_session:${sessionId}`,
      JSON.stringify(updatedSession),
      'EX',
      expiresInSec,
    );
  }

  // ✅ logout ТОЛЬКО текущего устройства
  async deleteSession(sessionId: string): Promise<void> {
    await this.redisClient.del(`refresh_session:${sessionId}`);
  }
}
