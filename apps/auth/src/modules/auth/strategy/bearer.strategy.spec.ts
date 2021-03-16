import { Test, TestingModule } from '@nestjs/testing';
import { BearerStrategy } from './bearer.strategy';

describe('BearerStrategy', () => {
  let provider: BearerStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BearerStrategy],
    }).compile();

    provider = module.get<BearerStrategy>(BearerStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
