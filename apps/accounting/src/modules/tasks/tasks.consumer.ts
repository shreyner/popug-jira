import { Inject, Injectable, Logger } from '@nestjs/common';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import { Task } from '../../../../task-tracker/src/entities';
import { TasksService } from './tasks.service';

//TODO: Убрать дублирование событий
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
export class TasksConsumer {
  private readonly logger = new Logger(TasksConsumer.name);

  constructor(
    @Inject(TasksService)
    private readonly tasksService: TasksService,
  ) {}

  async handleEvent(
    event:
      | EventTaskCUD
      | EventTaskCreated
      | EventTaskClosed
      | EventTaskAssigned,
  ) {
    this.logger.log(`Consume event`);
    console.log(event);

    switch (event.eventName) {
      case 'TaskCreated':
        await this.tasksService.addTaskOrSkip(event.data);
        break;
      default:
        // TODO: I don't know
        this.logger.error(`Not handle event: ${(event as any).eventName}`);
        throw new Error('Event not consumed');
    }
  }
}
