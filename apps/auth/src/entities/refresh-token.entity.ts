import {
  BaseEntity,
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Client } from './clien.entityt';
import { User } from './user.entity';
import { RefreshTokenInterface } from '../modules/oauth2/interface/refresh-token.interface';

@Entity({})
export class RefreshToken
  extends BaseEntity<RefreshToken, 'id'>
  implements RefreshTokenInterface
{
  @PrimaryKey({ index: true, type: BigIntType })
  id: bigint;

  @Property({ unique: true, index: true })
  token: string;

  @ManyToOne({ entity: () => Client })
  client: Client;

  @ManyToOne({ entity: () => User })
  user: User;

  constructor({
    token,
    user,
    client,
  }: {
    token: string;
    client: Client;
    user: User;
  }) {
    super();

    this.token = token;
    this.client = client;
    this.user = user;
  }
}
