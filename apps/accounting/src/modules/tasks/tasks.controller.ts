import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { TasksConsumer } from './tasks.consumer';

@Controller('tasks')
export class TasksController {
  constructor(
    @Inject(TasksConsumer)
    private readonly tasksConsumer: TasksConsumer,
  ) {}

  @EventPattern('task')
  async listenBETaskEvent(
    @Payload() data: BaseEvent<any, any>,
    @Ctx() ctx: NatsStreamingContext,
  ) {
    await this.tasksConsumer.handleEvent(data);
    ctx.message.ack();
  }
}
