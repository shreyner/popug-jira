import {
  BaseEntity,
  Entity,
  Enum,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { UserRole } from '../../../auth/src/modules/users/enum/user-role';
import { Wallet } from './wallet.entity';

@Entity({})
export class User extends BaseEntity<User, 'id'> {
  @PrimaryKey({ index: true })
  id: number;

  @Property({ unique: true })
  email: string;

  @Property({ unique: true, index: true })
  publicId: string;

  @Enum(() => UserRole)
  role: UserRole;

  @OneToOne({ entity: () => Wallet })
  wallet: Wallet;
}
