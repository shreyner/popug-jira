import {
  BaseEntity,
  Entity,
  EntityRepositoryType,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole } from '../../../auth/src/modules/users/enum/user-role'; // FIXME:
import { UserRepository } from '../repositories/user.repository';

@Entity({
  customRepository: () => UserRepository,
})
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey({ index: true })
  id: number;

  @Property()
  email: string;

  @Property()
  publicId: string;

  @Enum(() => UserRole)
  role: UserRole;

  constructor({
    email,
    role,
    publicId,
  }: {
    publicId: string;
    email: string;
    role: UserRole;
  }) {
    super();

    this.email = email;
    this.role = role;
    this.publicId = publicId;
  }

  [EntityRepositoryType]?: UserRepository;
}
