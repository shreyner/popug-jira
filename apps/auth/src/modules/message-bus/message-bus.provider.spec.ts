import { Test, TestingModule } from '@nestjs/testing';
import { MessageBusProvider } from './message-bus.provider';

describe('MessageBus', () => {
  let provider: MessageBusProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageBusProvider],
    }).compile();

    provider = module.get<MessageBusProvider>(MessageBusProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
