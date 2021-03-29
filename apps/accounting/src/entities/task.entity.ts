import {
  BaseEntity,
  Entity,
  EntityRepositoryType,
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
import { TaskRepository } from '../repositories/task.repository';

@Entity({
  customRepository: () => TaskRepository,
})
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

  constructor({
    publicId,
    assignUser,
    state,
    price,
    description,
  }: {
    publicId: string;
    description: string;
    state: TaskState;
    assignUser?: User;
    price?: TaskPrice;
  }) {
    super();

    this.publicId = publicId;
    this.description = description;
    this.state = state;
    this.assignUser = assignUser;
    this.price = price;
  }

  [EntityRepositoryType]?: TaskRepository;
}
