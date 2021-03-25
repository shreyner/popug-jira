import { Module } from '@nestjs/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
import { MessageBusProvider } from '../../../../auth/src/modules/message-bus/message-bus.provider';

@Module({
  imports: [
    NatsStreamingTransport.register({
      clientId: 'task-tracker-service-publisher',
      clusterId: 'test-cluster',
      connectOptions: {
        url: 'http://localhost:4222',
      },
    }),
  ],
  providers: [MessageBusProvider],
  exports: [MessageBusProvider],
})
export class MessageBusModule {} // FIXME: Вынести в отдельную lib
