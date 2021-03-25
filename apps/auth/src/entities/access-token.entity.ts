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
import { AccessTokenInterface } from '../modules/oauth2/interface/access-token.interface';

@Entity({})
export class AccessToken
  extends BaseEntity<AccessToken, 'id'>
  implements AccessTokenInterface {
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
    client,
    user,
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
