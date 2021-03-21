import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import * as qs from 'qs';
import { Request, Response } from 'express';

@Catch(UnauthorizedException)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof UnauthorizedException) {
      const query = {
        ...request.query,
        redirect_to: request.path,
      };

      response.redirect(`/auth?${qs.stringify(query)}`);
    }
  }
}
