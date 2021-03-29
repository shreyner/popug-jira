import shuffle from 'lodash/shuffle';
import sample from 'lodash/sample';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import schemaEventBETaskCreated from '@app/event-schemas/task/be/task-created/1.json';
import schemaEventCUDTaskCreated from '@app/event-schemas/task/cud/task-created/1.json';
import schemaEventBETaskAssigned from '@app/event-schemas/task/be/task-assigned/1.json';
import schemaEventCUDTaskUpdate from '@app/event-schemas/task/cud/task-updated/1.json';
import schemaEventBETaskClosed from '@app/event-schemas/task/be/task-closed/1.json';
import { Task, User } from '../../entities';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskState } from './enum/task-status.enum';
import { UserRole } from '../../../../auth/src/modules/users/enum/user-role';
import { TaskRepository } from '../../repositories/task.repository';
import { UserRepository } from '../../repositories/user.repository'; // FIXME: Вынести в отдельную lib
import { MessageBusProvider } from '../../../../auth/src/modules/message-bus/message-bus.provider';

type EventTaskCUD = BaseEvent<
  'TaskUpdated',
  Pick<Task, 'publicId'> &
    Partial<Pick<Task, 'state' | 'description'>> & {
      assignUser?: { publicId: string | null };
    }
>;

type EventTaskCreated = BaseEvent<
  'TaskCreated',
  Pick<Task, 'publicId' | 'description' | 'state'> & {
    assignUser?: { publicId: string | null };
  }
>;
type EventTaskClosed = BaseEvent<
  'TaskClosed',
  Pick<Task, 'publicId' | 'state'>
>;
type EventTaskAssigned = BaseEvent<
  'TaskAssigned',
  Pick<Task, 'publicId'> & {
    assignUser: { publicId: string | null };
  }
>;

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: TaskRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @Inject(MessageBusProvider)
    private readonly mb: MessageBusProvider,
  ) {}

  getOpenTask(): Promise<Task[]> {
    return this.tasksRepository.find({ state: TaskState.Open });
  }

  async create(createTask: CreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create(createTask);

      await this.tasksRepository.persistAndFlush(task);

      this.mb.sendEvent<EventTaskCreated>(
        'task',
        'TaskCreated',
        {
          publicId: task.publicId,
          state: task.state,
          description: task.description,
          assignUser: {
            publicId: null,
          },
        },
        schemaEventBETaskCreated,
      );

      this.mb.sendEvent<EventTaskCreated>(
        'task-stream',
        'TaskCreated',
        {
          publicId: task.publicId,
          state: task.state,
          description: task.description,
          assignUser: {
            publicId: null,
          },
        },
        schemaEventCUDTaskCreated,
      );

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

    this.mb.sendEvent<EventTaskClosed>(
      'task',
      'TaskClosed',
      {
        publicId: task.publicId,
        state: task.state,
      },
      schemaEventBETaskClosed,
    );

    this.mb.sendEvent<EventTaskCUD>(
      'task-stream',
      'TaskUpdated',
      {
        publicId: task.publicId,
        state: task.state,
        description: task.description,
      },
      schemaEventCUDTaskUpdate,
    );

    await this.tasksRepository.persistAndFlush(task);
  }

  async reAssignAll(user: User) {
    console.log('user.role', user.role);
    if (![UserRole.Manager, UserRole.Admin].includes(user.role)) {
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

    shuffledOpenedTasks.forEach((task) => {
      this.mb.sendEvent<EventTaskAssigned>(
        'task',
        'TaskAssigned',
        {
          publicId: task.publicId,
          assignUser: {
            publicId: task.assignUser.publicId,
          },
        },
        schemaEventBETaskAssigned,
      );

      this.mb.sendEvent<EventTaskCUD>('task-stream', 'TaskUpdated', {
        publicId: task.publicId,
        assignUser: {
          publicId: task.assignUser.publicId,
        },
      });
    });
  }
}
