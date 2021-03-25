import { Injectable } from '@nestjs/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { v4 as uuid } from 'uuid';
import { Event } from './event.type';

//TODO: Что это такое и как его именовать?
@Injectable()
export class MessageBusProvider {
  constructor(private readonly publisher: Publisher) {}

  sendEvent<T extends Event<string, unknown>>(
    topic: string,
    eventName: T['eventName'],
    data: T['data'],
  ) {
    const event = {
      eventId: uuid(),
      eventVersion: 1,
      eventTime: Date.now(),
      producer: 'auth-service',
      eventName: eventName,
      data,
    };

    console.log('SendEvent topic: %s . event: %o', topic, event);

    return this.publisher.emit(topic, event);
  }
}
