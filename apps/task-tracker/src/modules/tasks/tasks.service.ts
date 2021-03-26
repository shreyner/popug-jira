import shuffle from 'lodash/shuffle';
import sample from 'lodash/sample';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Task, User } from '../../entities';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskState } from "./enum/task-status.enum";
import { UserRole } from '../../../../auth/src/modules/users/enum/user-role';
import { TaskRepository } from '../../repositories/task.repository';
import { UserRepository } from '../../repositories/user.repository'; // FIXME: Вынести в отдельную lib

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: TaskRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
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

  async reAssignAll(user: User) {
    if (user.role !== UserRole.Manager) {
      throw new ForbiddenException();
    }

    const [shuffledOpenedTasks, users] = await Promise.all([
      this.tasksRepository.getOpen().then<Task[]>(shuffle),
      this.userRepository.findAll(),
    ]);

    shuffledOpenedTasks.forEach((task) => {
      task.assignUser = sample(users);
    });

    await this.tasksRepository.persistAndFlush(shuffledOpenedTasks);
  }
}
