import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AccessToken } from '../../../entities';

@Injectable()
export class AccessTokenService {
  constructor(
    @InjectRepository(AccessToken)
    private readonly accessTokenRepository: EntityRepository<AccessToken>,
  ) {}

  async findByToken(token: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.findOne({ token }, ['user', 'client']);
  }
}
