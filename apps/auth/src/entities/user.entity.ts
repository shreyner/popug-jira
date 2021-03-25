import { v4 as uuidV4 } from 'uuid';
import {
  Entity,
  Enum,
  PrimaryKey,
  Property,
  BaseEntity,
  EntityRepositoryType,
} from '@mikro-orm/core';
import { UserInterface } from '../modules/users/interface/user.interface';
import { UserRole } from '../modules/users/enum/user-role';
import { UserRepository } from '../repositories/user.repository';

@Entity({
  customRepository: () => UserRepository,
})
export class User extends BaseEntity<User, 'id'> implements UserInterface {
  @PrimaryKey({ index: true })
  id: number;

  @Property({ unique: true })
  email: string;

  @Property({ unique: true, onCreate: () => uuidV4() })
  publicId: string;

  // TODO: Добавить bcrypto
  @Property({ hidden: true })
  private encryptedPassword: string;

  @Enum(() => UserRole)
  role: UserRole;

  @Property({ hidden: true, persist: false })
  set password(password: string) {
    this.encryptedPassword = password;
  }

  constructor({
    email,
    role = UserRole.Employee,
  }: {
    email: string;
    role: UserRole;
  }) {
    super();

    this.email = email;
    this.role = role;
  }

  validatePassword(password: string): boolean {
    return this.encryptedPassword === password;
  }

  [EntityRepositoryType]?: UserRepository;
}
