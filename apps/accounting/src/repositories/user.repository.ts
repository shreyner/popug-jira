import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../entities';

export class UserRepository extends EntityRepository<User> {
  async findById(id: number): Promise<User | null> {
    return this.findOne({ id });
  }
}
