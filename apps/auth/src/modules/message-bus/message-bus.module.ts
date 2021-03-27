import { Module } from '@nestjs/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { validate } from 'jsonschema';
import { MessageBusProvider } from './message-bus.provider';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: 'auth-service-publisher',
      clusterId: 'test-cluster',
      connectOptions: {
        url: 'http://localhost:4222',
      },
    }),
  ],
  providers: [
    MessageBusProvider,
    {
      provide: 'JSON_VALIDATOR',
      useValue: validate,
    },
  ],
  exports: [MessageBusProvider],
})
export class MessageBusModule {} // FIXME: Вынести в отдельную lib
// FIXME: Убрать дублирование модуля
