import {
  BaseEntity,
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from './user.entity';
import { Transaction } from './transaction.entity';
import { PayoutCyrcle } from './payout-cyrcle.entity';

@Entity({})
export class Wallet extends BaseEntity<Wallet, 'id'> {
  @PrimaryKey({ index: true })
  id: number;

  @Property({ default: 0, onCreate: () => 0 })
  balance: number;

  @OneToOne({ index: true, owner: true, entity: () => User })
  user: User;

  @OneToMany({
    entity: () => Transaction,
    mappedBy: (transactio) => transactio.wallet,
  })
  transactions = new Collection<Transaction>(this);

  @OneToMany({
    entity: () => PayoutCyrcle,
    mappedBy: (payoutCyrcle) => payoutCyrcle.wallet,
  })
  payoutCyrcle = new Collection<PayoutCyrcle>(this);
}
