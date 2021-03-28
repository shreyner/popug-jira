import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Injectable()
export class Oauth2Guard extends AuthGuard('oauth2') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActive = (await super.canActivate(context)) as boolean;

    if (!canActive) {
      return canActive;
    }

    const request = context.switchToHttp().getRequest<Request>();
    await super.logIn(request);

    return canActive;
  }
}
