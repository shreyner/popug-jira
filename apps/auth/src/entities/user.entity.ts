import { Entity, Enum, PrimaryKey, Property, wrap } from '@mikro-orm/core';
import { UserInterface } from '../modules/users/interface/user.interface';
import { UserRole } from '../modules/users/enum/user-role';

@Entity({})
export class User implements UserInterface {
  @PrimaryKey({ index: true })
  id: number;

  @Property()
  email: string;

  // TODO: Добавить bcrypto
  @Property({ hidden: true })
  private encryptedPassword: string;

  @Enum(() => UserRole)
  role: UserRole;

  @Property({ hidden: true, persist: false })
  set password(password: string) {
    this.encryptedPassword = password;
  }

  validatePassword(password: string): boolean {
    return this.encryptedPassword === password;
  }

  constructor({
    email,
    role = UserRole.Employee,
  }: {
    email: string;
    role: UserRole;
  }) {
    this.email = email;
    this.role = role;
  }
}