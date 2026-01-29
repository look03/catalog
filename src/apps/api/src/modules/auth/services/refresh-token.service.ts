import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import Redis from 'ioredis';
import { JwtPayload, RefreshSession } from '../types/auth.types';
import { JwtService } from '@nestjs/jwt';
import { REDIS } from '../constants/redis.constants';
import { getDetailsErrorUtil } from '../../../common/utils/error.utils';
import { JWT } from '../constants/jwt.constants';
import { randomUUID } from 'crypto';

@Injectable()
export class RefreshTokenService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,

    private readonly jwtService: JwtService,
  ) {}

  private getRedisKey(sessionId: string): string {
    return `refresh_session:${sessionId}`;
  }

  private getRevokedRedisKey(sessionId: string): string {
    return `revoked_session:${sessionId}`;
  }

  async saveSession(
    sessionId: string,
    userId: string,
    refreshToken: string,
    jti: string,
  ): Promise<void> {
    const payload: RefreshSession = {
      userId,
      refreshToken,
      sid: sessionId,
      jti,
      createdAt: Date.now(),
    };

    try {
      await this.redisClient.set(
        this.getRedisKey(sessionId),
        JSON.stringify(payload),
        'EX',
        REDIS.EXPIRES_IN_SEC,
      );
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'Failed to save session token in redis',
        details: getDetailsErrorUtil(error),
      });
    }
  }

  async getSession(sessionId: string): Promise<RefreshSession | null> {
    const data = await this.redisClient.get(this.getRedisKey(sessionId));
    if (!data) {
      return null;
    }

    return JSON.parse(data) as RefreshSession;
  }

  async isSessionRevoked(sessionId: string): Promise<boolean> {
    const revokedKey = this.getRevokedRedisKey(sessionId);
    const exists = await this.redisClient.exists(revokedKey);
    return exists === 1;
  }

  /**
   * Отзывает сессию (принудительно делает ее недействительной)
   * @param sessionId ID сессии для отзыва
   * @param reason Причина отзыва (для логов)
   * @param ttl Время хранения записи об отзыве в секундах (по умолчанию 7 дней)
   */
  async revokeSession(sessionId: string, reason: string = 'manual_revoke'): Promise<void> {
    const session = await this.getSession(sessionId);

    await this.deleteSession(sessionId);

    const revokeData = {
      sessionId,
      revokedAt: Date.now(),
      reason,
      userId: session?.userId,
      originalJti: session?.jti,
    };

    try {
      await this.redisClient.set(
        this.getRevokedRedisKey(sessionId),
        JSON.stringify(revokeData),
        'EX',
        REDIS.EXPIRES_IN_SEC,
      );
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'Failed to save revoke session token in redis',
        details: getDetailsErrorUtil(error),
      });
    }
  }

  shouldRotateRefresh(exp: number): boolean {
    const now = Math.floor(Date.now() / 1000);
    return exp - now <= JWT.REFRESH_RENEW_THRESHOLD_SEC;
  }

  async validateSession(
    sessionId: string,
  ): Promise<{ payload: JwtPayload; session: RefreshSession }> {
    if (await this.isSessionRevoked(sessionId)) {
      throw new UnauthorizedException('Session revoked');
    }

    const session = await this.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(session.refreshToken);
    } catch {
      await this.deleteSession(sessionId);
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (payload.jti !== session.jti) {
      await this.revokeSession(sessionId, 'jti_mismatch');
      throw new UnauthorizedException('Invalid refresh token');
    }

    return { payload, session };
  }

  async rotateRefreshSession(sessionId: string, payload: JwtPayload): Promise<void> {
    const newJti = randomUUID();

    const newRefreshToken = this.jwtService.sign(
      {
        sub: payload.sub,
        roles: payload.roles,
        sid: sessionId,
        jti: newJti,
        type: 'refresh',
      },
      {
        expiresIn: JWT.REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    const session = await this.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const updatedSession: RefreshSession = {
      ...session,
      jti: newJti,
      refreshToken: newRefreshToken,
    };

    await this.redisClient.set(
      this.getRedisKey(sessionId),
      JSON.stringify(updatedSession),
      'EX',
      JWT.REFRESH_TTL_SEC,
    );
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!sessionId) {
      throw new BadRequestException('Not session id');
    }

    try {
      await this.redisClient.del(this.getRedisKey(sessionId));
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: 'Failed to delete session in redis',
        details: getDetailsErrorUtil(error),
      });
    }
  }
}
