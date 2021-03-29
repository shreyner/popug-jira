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

  async createUser(
    targetUser: Pick<User, 'publicId' | 'email' | 'role'>,
  ): Promise<User> {
    const user = new User();
    const wallet = new Wallet();

    user.assign(targetUser);
    user.wallet = wallet;

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async addUserOrSkip(targetUser: Pick<User, 'publicId' | 'email' | 'role'>) {
    const user = await this.userRepository.findByPublicId(targetUser.publicId);

    if (!isNil(user)) {
      return user;
    }

    return this.createUser(targetUser);
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

  async updateByPublicId(
    targetUser: Pick<User, 'publicId'> & Partial<Pick<User, 'email' | 'role'>>,
  ): Promise<User> {
    const user = await this.userRepository.findOneOrFail({
      publicId: targetUser.publicId,
    });

    user.assign(targetUser);

    await this.userRepository.persistAndFlush(user);

    return user;
  }
}
