import {
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Client } from './client';
import { User } from './user';
import { AccessTokenInterface } from '../modules/oauth2/interface/access-token.interface';

@Entity({})
export class AccessToken implements AccessTokenInterface {
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
    this.token = token;
    this.client = client;
    this.user = user;
  }
}
