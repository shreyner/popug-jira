import { Controller, Inject } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { NatsStreamingContext } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { BaseEvent } from '@app/event-schema-registry/types/base-event.type';
import { UsersService } from './users.service';
import { UsersConsumer } from './users.consumer';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService)
    private readonly userService: UsersService,
    @Inject(UsersConsumer)
    private readonly userConsumer: UsersConsumer,
  ) {}

  @EventPattern('user')
  async listenUserEvents(
    @Payload() data: BaseEvent<any, any>,
    @Ctx() ctx: NatsStreamingContext,
  ) {
    await this.userConsumer.handleEvent(data);
    ctx.message.ack();
  }

  @EventPattern('user-stream')
  async listerUserCUDEvents(
    @Payload() data: BaseEvent<any, any>,
    @Ctx() ctx: NatsStreamingContext,
  ): Promise<void> {
    await this.userConsumer.handleEvent(data);
    ctx.message.ack();
  }
}
