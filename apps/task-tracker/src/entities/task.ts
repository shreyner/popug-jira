import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  BigIntType,
} from '@mikro-orm/core';

import { ITask, TaskState } from '../modules/tasks/interfaces/tasks.interface';

@Entity({})
export class Task implements ITask {
  @PrimaryKey({ index: true, type: BigIntType })
  id: string;

  @Property()
  description: string;

  @Enum({ items: () => TaskState, defaultRaw: TaskState.Open })
  state: TaskState;

  @Property()
  createdAt: Date = new Date();
}
