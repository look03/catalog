import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { errorLogger } from '../logger/error.logger';

interface ErrorResponse {
  message?: string;
  details?: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorResponse: unknown;
    if (exception instanceof HttpException) {
      errorResponse = exception.getResponse();
    } else if (exception instanceof Error) {
      errorResponse = { message: exception.message };
    } else {
      errorResponse = { message: 'Internal Server Error' };
    }

    const errorRespObj = errorResponse as ErrorResponse;

    const message =
      typeof errorResponse === 'string' ? errorResponse : (errorRespObj.message ?? 'Error');

    const details =
      errorResponse && typeof errorResponse === 'object' && 'details' in errorRespObj
        ? errorRespObj.details
        : null;

    const errorData = {
      success: false,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    errorLogger.error({ ...errorData, status });

    response.status(status).json(errorData);
  }
}
