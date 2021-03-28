import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Wallet } from './wallet.entity';
import { PayoutCyrcle } from './payout-cyrcle.entity';

@Entity({})
export class Transaction extends BaseEntity<Transaction, 'id'> {
  @PrimaryKey({ index: true })
  id: number;

  @Property()
  debit: number;

  @Property()
  credit: number;

  @Property()
  balance: number;

  @Property()
  description: string;

  @Property({ onCreate: () => Date.now().toString() })
  date: string;

  @ManyToOne({ entity: () => Wallet })
  wallet: Wallet;

  @OneToOne({ entity: () => PayoutCyrcle, nullable: true })
  payoutCyrcle?: PayoutCyrcle;
}
