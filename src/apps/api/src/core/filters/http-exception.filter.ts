import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { errorLogger } from '../logger/error.logger';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: exception.message || 'Internal Server Error' };

    const errorData = {
      success: false,
      message: errorResponse['message'] ?? 'Error',
      details: errorResponse['details'] ?? null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    errorLogger.error({ ...errorData, status });

    response.status(status).json(errorData);
  }
}
