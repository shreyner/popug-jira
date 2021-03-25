import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../entities';

export class UserRepository extends EntityRepository<User> {
  async findById(id: number): Promise<User | null> {
    return this.findOne({ id });
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