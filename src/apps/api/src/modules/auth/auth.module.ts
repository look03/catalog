import { Module } from '@nestjs/common';
import * as IORedis from 'ioredis';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './infrastructure/jwt.strategy';
import { JwtGuard } from './infrastructure/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { commandHandlers } from './commands/handlers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { RefreshTokenService } from './services/refresh-token.service';
import * as process from 'node:process';
import { entities } from './entities';
import { JwtTokenService } from './services/jwt-token.service';

@Module({
  imports: [
    CqrsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '15m' },
    }),
    TypeOrmModule.forFeature(entities),
  ],
  providers: [
    ...commandHandlers,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new IORedis.default({
          host: 'redis',
          port: 6379,
        });
      },
    },
    JwtStrategy,
    JwtGuard,
    UserService,
    RefreshTokenService,
    JwtTokenService,
  ],
  controllers: [AuthController],
  exports: ['REDIS_CLIENT', UserService, RefreshTokenService],
})
export class AuthModule {}
