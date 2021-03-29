import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../entities';
import { isNil } from '@nestjs/common/utils/shared.utils';

export class UserRepository extends EntityRepository<User> {
  async findById(id: number): Promise<User | null> {
    return this.findOne({ id });
  }

  // TODO: Вынести в сервис
  async addUser(userData: Pick<User, 'publicId' | 'email' | 'role'>) {
    const user = this.create(userData);

    await this.persistAndFlush(user);

    return user;
  }

  findByPublicId(publicId: string): Promise<User | null> {
    return this.findOne({ publicId });
  }

  // TODO: Вынести в сервис
  async addUserOrSkip(
    userData: Pick<User, 'publicId' | 'email' | 'role'>,
  ): Promise<User | null> {
    const user = await this.findByPublicId(userData.publicId);

    if (!isNil(user)) {
      return user;
    }

    return this.addUser(userData);
  }

  async updateByPublicId(
    targetUser: Partial<User> & Pick<User, 'publicId'>,
  ): Promise<User> {
    const user = await this.findOneOrFail({
      publicId: targetUser.publicId,
    });

    user.assign(targetUser);

    await this.persistAndFlush(user);

    return user;
  }
}
