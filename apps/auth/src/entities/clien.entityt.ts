import {
  BaseEntity,
  BigIntType,
  Entity,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { ClientInterface } from '../modules/clients/interface/client.interface';

@Entity({})
export class Client
  extends BaseEntity<Client, 'id'>
  implements ClientInterface {
  @PrimaryKey({ index: true, type: BigIntType })
  id: bigint;

  @Property({ index: true, unique: true })
  clientId!: string;

  @Property({ unique: true }) // TODO: add hidden field
  clientSecret!: string;

  @Property()
  name!: string;

  @Property()
  redirectUrl!: string;

  @Property({ default: false })
  isTrusted!: boolean;

  constructor({
    clientId,
    clientSecret,
    name,
    redirectUrl,
    isTrusted,
  }: {
    clientId: string;
    clientSecret: string;
    name: string;
    redirectUrl: string;
    isTrusted: boolean;
  }) {
    super();

    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.name = name;
    this.redirectUrl = redirectUrl;
    this.isTrusted = isTrusted;
  }
}
