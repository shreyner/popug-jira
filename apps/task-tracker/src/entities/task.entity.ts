import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  BigIntType,
} from '@mikro-orm/core';

import { TaskInterface } from '../modules/tasks/interface/tasks.interface';
import { TaskState } from '../modules/tasks/enum/task-status.enum';

@Entity({})
export class Task implements TaskInterface {
  @PrimaryKey({ index: true, type: BigIntType })
  id: string;

  @Property()
  description: string;

  @Enum({ items: () => TaskState, default: TaskState.Open })
  state: TaskState;

  @Property()
  createdAt: Date = new Date();
}
