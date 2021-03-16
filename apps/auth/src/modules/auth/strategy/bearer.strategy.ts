import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  async validate(token: string): Promise<any> {
    if (token !== '123') {
      throw new UnauthorizedException();
    }

    return {
      id: '1',
      email: 'a@b.c',
      role: 'user',
    };
  }
}
