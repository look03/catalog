import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
  [key: string]: any;
}

@Injectable()
export class TransformInterceptor implements NestInterceptor<unknown, ApiResponse<unknown>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<ApiResponse<unknown>> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse<Response>();

    return next.handle().pipe(
      map((data: TokenResponse) => {
        if (data?.refreshToken && data?.sessionId) {
          res.cookie('token', data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
          });

          res.cookie('sessionId', data.sessionId, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
          });

          const rest = { ...data };
          delete rest.refreshToken;
          delete rest.sessionId;

          return {
            success: true,
            message: 'OK',
            data: rest,
          };
        }

        return {
          success: true,
          message: 'OK',
          data,
        };
      }),
    );
  }
}
