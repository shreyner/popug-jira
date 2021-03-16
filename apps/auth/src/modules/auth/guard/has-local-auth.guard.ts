import { CanActivate, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class HasLocalAuthGuard
  extends AuthGuard('local')
  implements CanActivate {}
