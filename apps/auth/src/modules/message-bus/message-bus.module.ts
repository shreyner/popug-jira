import { Module } from '@nestjs/common';
import { NatsStreamingTransport } from '@nestjs-plugins/nestjs-nats-streaming-transport';
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
  providers: [MessageBusProvider],
  exports: [MessageBusProvider],
})
export class MessageBusModule {}
