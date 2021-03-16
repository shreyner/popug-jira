import {
  BigIntType,
  Entity,
  Enum,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserInterface } from '../modules/users/interface/user.interface';
import { UserRole } from '../modules/users/enum/user-role';

@Entity({})
export class User implements UserInterface {
  @PrimaryKey({ index: true, type: BigIntType })
  id: string;

  @Property()
  email: string;

  @Property()
  password: string;

  @Enum(() => UserRole)
  role: UserRole;
}
