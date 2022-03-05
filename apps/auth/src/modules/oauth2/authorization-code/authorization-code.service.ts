import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthorizationCode } from '../../../entities';

@Injectable()
export class AuthorizationCodeService {
  constructor(
    @InjectRepository(AuthorizationCode)
    private readonly authorizationCodeRepository: EntityRepository<AuthorizationCode>,
  ) {}

  private generateGrantCode() {
    const randomBite = crypto.randomBytes(32);

    return Buffer.from(randomBite).toString('hex');
  }

  async createGrantCode({
    client,
    user,
    redirectUri,
  }): Promise<AuthorizationCode> {
    const code = this.generateGrantCode();

    const authorizationCode = new AuthorizationCode({
      code,
      client,
      user,
      redirectUri,
    });

    await this.authorizationCodeRepository.persistAndFlush(authorizationCode);

    return authorizationCode;
  }

  async getAuthGrantByCode(code: string): Promise<AuthorizationCode | null> {
    return this.authorizationCodeRepository.findOne({ code }, [
      'client',
      'user',
    ]);
  }
}
