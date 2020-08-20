import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if(!data) {
          throw new HttpException('The data you requested is not found', HttpStatus.NOT_FOUND);
        }
        Logger.log(
          `Response: \n ${JSON.stringify(data)}`,
          'ResponseDataInterceptor',
        );
        return {
          success: true,
          message: 'Retrieved data successfully',
          data: data,
        };
      })
    );
  }
}
