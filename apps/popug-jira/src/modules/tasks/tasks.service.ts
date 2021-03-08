import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Task } from '../../entities';
import { TaskState } from './interfaces/tasks.interface';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: EntityRepository<Task>,
  ) {}

  getOpenTask(): Promise<Task[]> {
    return this.tasksRepository.find({ state: TaskState.Open });
  }

  async create(createTask: CreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create(createTask);

      await this.tasksRepository.persistAndFlush(task);

      return task;
    } catch (e) {
      throw new BadRequestException();
    }
  }

  async complete(id: string): Promise<void> {
    const task: Task = await this.tasksRepository.findOne(id);

    if (!task) {
      throw new NotFoundException();
    }

    task.state = TaskState.Close;

    await this.tasksRepository.persistAndFlush(task);
  }
}
