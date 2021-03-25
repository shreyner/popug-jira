import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../entities';

export class UserRepository extends EntityRepository<User> {
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({ email });
  }

  async findById(id: unknown): Promise<User | null> {
    return this.findOne({ id });
  }

  async update(updateUser: Partial<User> & Pick<User, 'id'>): Promise<User> {
    const user = await this.findOneOrFail({ id: updateUser.id });

    user.assign(updateUser);

    await this.persistAndFlush(user);

    return user;
  }
}
