import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { UserRole } from '../../../auth/src/modules/users/enum/user-role';

@Entity({})
export class User {
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
    this.email = email;
    this.role = role;
    this.publicId = publicId;
  }
}
