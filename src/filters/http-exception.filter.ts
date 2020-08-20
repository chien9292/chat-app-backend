import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status = exception.getStatus();

    const errorResponse = {
      success: false,
      message: 'Failed to retrieve data!',
      data: {
        code: status,
        timestamp: new Date().toLocaleDateString(),
        path: request.url,
        method: request.method,
        message: exception.message,
      },
    };

    Logger.error(
      `${request.method} ${request.url}`,
      exception.stack,
      'HttpErrorHandlerFilter',
    );

    response.status(status).json(errorResponse);
  }
}
