import {
  BaseEntity,
  Entity,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Task } from './task.entity';

@Entity({})
export class TaskPrice extends BaseEntity<TaskPrice, 'id'> {
  @PrimaryKey({ index: true })
  id: number;

  @Property()
  cost: number;

  @Property()
  reword: number;

  @OneToOne({ owner: true, index: true, entity: () => Task })
  task: Task;
}
