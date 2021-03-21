import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserInterface } from '../modules/users/interface/user.interface';
import { UserRole } from '../modules/users/enum/user-role';

@Entity({})
export class User implements UserInterface {
  @PrimaryKey({ index: true, type: 'number' })
  id: number;

  @Property()
  email: string;

  // TODO: Скрыть пароль и добавить bcrypto
  @Property()
  password: string;

  @Enum(() => UserRole)
  role: UserRole;
}
