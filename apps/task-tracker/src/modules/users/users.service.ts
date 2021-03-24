import { isNil } from '@nestjs/common/utils/shared.utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { User } from '../../entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ id });
  }

  async findAndCreate(targetUser: User): Promise<User> {
    let user = await this.userRepository.findOne({ id: targetUser.id });

    if (isNil(user)) {
      user = new User(targetUser);

      await this.userRepository.persistAndFlush(user);
    }

    return user;
  }
}
