import { isNil } from '@nestjs/common/utils/shared.utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async getOrCreate(targetUser: User): Promise<User> {
    let user = await this.userRepository.findOne({
      publicId: targetUser.publicId,
    });

    if (isNil(user)) {
      user = new User(targetUser);

      await this.userRepository.persistAndFlush(user);
    }

    return user;
  }
}
