import {
  BigIntType,
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Client } from './client';
import { User } from './user';
import { AuthorizationCodeInterface } from '../modules/oauth2/interface/authorization-code.interface';

@Entity({})
export class AuthorizationCode implements AuthorizationCodeInterface {
  @PrimaryKey({ index: true, type: BigIntType })
  id: bigint;

  @Property({ index: true, unique: true })
  code!: string;

  @Property()
  redirectUri!: string;

  @ManyToOne({ entity: () => Client })
  client!: Client;

  @ManyToOne({ entity: () => User })
  user!: User;

  constructor({
    code,
    redirectUri,
    client,
    user,
  }: Omit<AuthorizationCode, 'id'>) {
    this.code = code;
    this.redirectUri = redirectUri;
    this.client = client;
    this.user = user;
  }
}
