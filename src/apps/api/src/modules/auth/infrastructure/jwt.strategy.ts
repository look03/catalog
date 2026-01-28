import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, JwtFromRequestFunction } from 'passport-jwt';
import * as process from 'node:process';
import { JwtPayload, JwtUser } from '../types/auth.types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET_KEY;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET_KEY is not defined');
    }

    const jwtFromRequest: JwtFromRequestFunction = ExtractJwt.fromAuthHeaderAsBearerToken();

    super({
      jwtFromRequest,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload): JwtUser {
    return {
      userId: payload.sub,
      roles: payload.roles,
    };
  }
}
