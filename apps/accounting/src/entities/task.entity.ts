import {
  BaseEntity,
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import { TaskState } from '../../../task-tracker/src/modules/tasks/enum/task-status.enum';
import { TaskPrice } from './task-price.entity';

@Entity({})
export class Task extends BaseEntity<Task, 'id'> {
  @PrimaryKey({ index: true })
  id: number;

  @Property({ unique: true, onCreate: () => uuid() })
  publicId: string;

  @Property()
  description: string;

  @Enum({ items: () => TaskState })
  state: TaskState;

  @ManyToOne({ entity: () => User, nullable: true })
  assignUser: User;

  @OneToOne({
    entity: () => TaskPrice,
    mappedBy: (taskPrice) => taskPrice.task,
    owner: false,
  })
  price: TaskPrice;
}
