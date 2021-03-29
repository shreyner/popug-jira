import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { UsersConsumer } from './users.consumer';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersConsumer)
    private readonly usersConsumer: UsersConsumer,
  ) {}

  @EventPattern('user')
  async listenBEUserEvent(
    @Payload() data: BaseEvent<any, any>,
    @Ctx() ctx: NatsStreamingContext,
  ) {
    await this.usersConsumer.handleEvent(data);
    ctx.message.ack();
  }

  @EventPattern('user-stream')
  async listenCUDUserEvent(
    @Payload() data: BaseEvent<any, any>,
    @Ctx() ctx: NatsStreamingContext,
  ) {
    await this.usersConsumer.handleEvent(data);
    ctx.message.ack();
  }
}
