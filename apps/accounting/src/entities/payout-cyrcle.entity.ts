import {
  BaseEntity,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Transaction } from './transaction.entity';
import { Wallet } from './wallet.entity';

@Entity({})
export class PayoutCyrcle extends BaseEntity<PayoutCyrcle, 'id'> {
  @PrimaryKey({ index: true })
  id: number;

  @Property()
  payoutAmount: number;

  @Property({ onCreate: () => Date.now().toString() })
  day: string;

  @OneToOne({ entity: () => Transaction, owner: true })
  transaction: Transaction;

  @ManyToOne({ entity: () => Wallet })
  wallet: Wallet;
}
