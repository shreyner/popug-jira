import { Test, TestingModule } from '@nestjs/testing';
import { EventSchemaRegistryService } from './event-schema-registry.service';

describe('EventSchemaRegistryService', () => {
  let service: EventSchemaRegistryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventSchemaRegistryService],
    }).compile();

    service = module.get<EventSchemaRegistryService>(EventSchemaRegistryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
