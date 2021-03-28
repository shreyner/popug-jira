import { isNil } from '@nestjs/common/utils/shared.utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User, Wallet } from '../../entities';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(targetUser: User): Promise<User> {
    const user = new User();
    const wallet = new Wallet();

    user.assign(targetUser);
    user.wallet = wallet;

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  // TODO: Добавить верку targetUser по схеме. Выглядет очень не надежно
  async getOrCreate(targetUser: User): Promise<User> {
    let user = await this.userRepository.findOne({
      publicId: targetUser.publicId,
    });

    if (isNil(user)) {
      user = await this.createUser(targetUser);
    }

    return user;
  }
}
