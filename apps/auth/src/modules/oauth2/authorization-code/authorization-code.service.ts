import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthorizationCodeEntity } from '../../../entities';
import { EntityRepository } from '@mikro-orm/core';
import { isNil } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class AuthorizationCodeService {
  constructor(
    @InjectRepository(AuthorizationCodeEntity)
    private readonly authorizationCodeRepository: EntityRepository<AuthorizationCodeEntity>,
  ) {}

  private generateGrantCode() {
    const randomBite = crypto.randomBytes(32);

    return Buffer.from(randomBite).toString('hex');
  }

  async createGrantCode({
    client,
    user,
    redirectUri,
  }): Promise<AuthorizationCodeEntity> {
    const code = this.generateGrantCode();

    const authorizationCode = new AuthorizationCodeEntity({
      code,
      client,
      user,
      redirectUri,
    });

    await this.authorizationCodeRepository.persistAndFlush(authorizationCode);

    return authorizationCode;
  }

  async getAuthGrantByCode(code: string): Promise<AuthorizationCodeEntity | null> {
    return this.authorizationCodeRepository.findOne({ code }, [
      'client',
      'user',
    ]);
  }
}
