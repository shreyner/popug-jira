import { Module } from '@nestjs/common';
import { EventSchemaRegistryService } from './event-schema-registry.service';

@Module({
  providers: [EventSchemaRegistryService],
  exports: [EventSchemaRegistryService],
})
export class EventSchemaRegistryModule {}
