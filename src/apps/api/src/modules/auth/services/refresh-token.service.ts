import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async saveRefreshToken(userId: string, token: string, expiresInSec: number) {
    await this.redisClient.set(`refresh_token:${userId}`, token, 'EX', expiresInSec);
  }

  async getRefreshToken(userId: string): Promise<string | null> {
    console.log(`refresh_token:${userId}`, '<<<<<<<<<<<<<< `refresh_token:${userId}`');
    return this.redisClient.get(`refresh_token:${userId}`);
  }

  async deleteRefreshToken(userId: string) {
    await this.redisClient.del(`refresh_token:${userId}`);
  }
}
