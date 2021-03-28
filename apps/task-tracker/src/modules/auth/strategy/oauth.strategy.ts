import { Strategy } from 'passport-oauth2';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { isNil } from '@nestjs/common/utils/shared.utils';
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
      clientID: 'b6bde2bd4c785e778c53ad3382688c6a',
      clientSecret: '520a68866334df1c530cebf572ae96179a719c5cbc2f8f7b',
      callbackURL: 'http://localhost:3070/auth/callback',
      skipUserProfile: false,
    });

    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  async validate(accessToken, refreshToken, profile) {
    return await this.userService.getOrCreate(profile);
  }

  // TODO: Необходимо добавить проверку контракта для профиля пользователя
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
