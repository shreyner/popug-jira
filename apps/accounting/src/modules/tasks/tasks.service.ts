import random from 'lodash/random';
import get from 'lodash/get';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Task, TaskPrice, User } from '../../entities';
import { TaskRepository } from '../../repositories/task.repository';
import { UserRepository } from '../../repositories/user.repository';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: TaskRepository,
    @InjectRepository(TaskPrice)
    private readonly taskPriceRepository: EntityRepository<TaskPrice>,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
  ) {}

  createTaskPrice(task: Task): TaskPrice {
    const taskPrice = new TaskPrice();
    const cost = random(10, 20);
    const reword = random(21, 40);

    taskPrice.cost = cost;
    taskPrice.reword = reword;
    taskPrice.task = task;

    return taskPrice;
  }

  async createTask(
    targetTask: Pick<Task, 'publicId' | 'description' | 'state'> & {
      assignUser?: { publicId?: string | null };
    },
  ): Promise<Task> {
    const task = new Task(targetTask as any);

    if (!isNil(get(targetTask, 'assignUser.publicId'))) {
      const user = await this.userRepository.findByPublicId(
        targetTask.assignUser.publicId,
      );

      if (!isNil(user)) {
        task.assignUser = user;
      }
    }

    task.price = this.createTaskPrice(task);

    await this.taskRepository.persistAndFlush(task);

    return task;
  }

  async addTaskOrSkip(
    targetTask: Pick<Task, 'publicId' | 'description' | 'state'> & {
      assignUser?: { publicId?: string | null };
    },
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      publicId: targetTask.publicId,
    });

    if (!isNil(task)) {
      return task;
    }

    return this.createTask(targetTask);
  }
}
