import { v4 as uuid } from 'uuid';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Publisher } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { validate } from 'jsonschema';
import { Event } from './event.type';

//TODO: Что это такое и как его именовать?
@Injectable()
export class MessageBusProvider {
  logger = new Logger('MessageBus');

  // FIXME: Вынести в отдельную lib
  constructor(
    private readonly publisher: Publisher,
    @Inject('JSON_VALIDATOR')
    private readonly validatorSchema: typeof validate,
  ) {}

  sendEvent<T extends Event<string, unknown>>(
    topic: string,
    eventName: T['eventName'],
    data: T['data'],
    schema?: unknown,
  ) {
    const event = {
      eventId: uuid(),
      eventVersion: 1,
      eventTime: Date.now().toString(),
      producer: 'auth-service',
      eventName: eventName,
      data,
    };

    if (schema) {
      const { valid, errors } = this.validatorSchema(event, schema);

      if (!valid) {
        this.logger.error(
          `Invalid event data. Topic: ${topic} . EventName: ${eventName} . Producer: ${event.producer} .`,
        );
        console.error(
          `Invalid event data. Topic: ${topic} . EventName: ${eventName} . Producer: ${event.producer} .`,
          errors,
        );
        throw new Error(); // TODO: Подставить кастомную ошибку
      }
    }

    console.log('SendEvent topic: %s . event: %o', topic, event);

    return this.publisher.emit(topic, event);
  }
}
