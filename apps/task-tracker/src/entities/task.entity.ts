import { v4 as uuid } from 'uuid';
import {
  Entity,
  PrimaryKey,
  Property,
  Enum,
  BigIntType,
  ManyToOne,
  BaseEntity,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { TaskInterface } from '../modules/tasks/interface/tasks.interface';
import { TaskState } from '../modules/tasks/enum/task-status.enum';
import { User } from './user.entity';
import { TaskRepository } from '../repositories/task.repository';

@Entity({
  customRepository: () => TaskRepository,
})
export class Task extends BaseEntity<Task, 'id'> implements TaskInterface {
  @PrimaryKey({ index: true, type: BigIntType })
  id: string;

  @Property({ unique: true, onCreate: () => uuid() })
  publicId: string;

  @Property()
  description: string;

  @Enum({ items: () => TaskState, default: TaskState.Open })
  state: TaskState;

  @ManyToOne({ entity: () => User, nullable: true })
  assignUser: User;

  @Property()
  createdAt: Date = new Date();

  [EntityRepositoryType]?: TaskRepository;
}
