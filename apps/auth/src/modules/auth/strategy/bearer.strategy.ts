import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AccessTokenService } from '../../tokens/access-token/access-token.service';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(AccessTokenService)
    private readonly accessTokenService: AccessTokenService,
  ) {
    super();
  }

  async validate(token: string): Promise<any> {
    //TODO: Добавить проверку proof как https://github.com/jaredhanson/passport-facebook/blob/master/lib/strategy.js#L139
    const accessToken = await this.accessTokenService.findByToken(token);

    if (isNil(accessToken)) {
      throw new ForbiddenException();
    }

    return accessToken.user;
  }
}
