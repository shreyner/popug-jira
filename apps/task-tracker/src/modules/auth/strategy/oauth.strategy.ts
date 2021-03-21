import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class OauthStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      authorizationURL: 'http://localhost:3080/oauth2/authorize',
      tokenURL: 'http://localhost:3080/oauth2/token',
      clientID:
        'dafd121a6995654eeaaf8375bd89b24716dd316450f2b5619bf24c88ce5e983b',
      clientSecret:
        '90aed6fe419fd608505fdd47e03c86c51649a4a26c785ea5c61db72a9857456d',
      callbackURL: 'http://localhost:3070/auth/callback',
      skipUserProfile: false,
    });

    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  async validate(accessToken, refreshToken, profile) {
    //TODO: Get or CreateUser
    console.log('Profile', profile);

    return profile;
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
            console.log('Error', err, userProfile);
            if (!isNil(err)) {
              return reject(err);
            }

            return resolve(userProfile);
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
