import { isNil } from '@nestjs/common/utils/shared.utils';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';

import { UsersService } from '../../users/users.service';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
  ) {
    super({
      authorizationURL: 'http://localhost:3080/oauth2/authorize',
      tokenURL: 'http://localhost:3080/oauth2/token',
      clientID:
        'a12d3d037fa94d9441f7bc52cc72aa1163facafb208a511acf627ed22527ecd3',
      clientSecret:
        'd65e651b4ac29fa5f7f2571ca46699aea47049ba91c0ff8c6911a79c52ac551d',
      callbackURL: 'http://localhost:3060/auth/callback',
      skipUserProfile: false,
    });

    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  async validate(accessToken, refreshToken, profile) {
    return await this.userService.getOrCreate(profile);
  }

  async userProfile(
    accessToken: string,
    done: (err: any, profile?: any) => void,
  ) {
    try {
      const userProfile = await new Promise((resolve, reject) => {
        this._oauth2.get(
          'http://localhost:3080/profiles/me',
          accessToken,
          (err, userProfile) => {
            if (!isNil(err)) {
              return reject(err);
            }

            return resolve(JSON.parse(userProfile as string));
          },
        );
      });

      return done(null, userProfile);
    } catch (e) {
      done(e);
      throw e;
    }
  }
}
