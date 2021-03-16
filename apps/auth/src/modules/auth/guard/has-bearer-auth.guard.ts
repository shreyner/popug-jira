import { CanActivate, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class HasBearerAuthGuard
  extends AuthGuard('bearer')
  implements CanActivate {}
