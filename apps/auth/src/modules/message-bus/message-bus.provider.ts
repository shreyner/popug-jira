import { Injectable } from '@nestjs/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { v4 as uuid } from 'uuid';

//TODO: Что это такое и как его именовать?
@Injectable()
export class MessageBusProvider {
  constructor(private readonly publisher: Publisher) {}

  sendEvent<T extends unknown>(topic: string, eventName: string, data: T) {
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
