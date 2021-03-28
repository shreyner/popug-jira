import { Test, TestingModule } from '@nestjs/testing';
import { UsersConsumer } from './users.consumer';

describe('UsersConsumer', () => {
  let provider: UsersConsumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersConsumer],
    }).compile();

    provider = module.get<UsersConsumer>(UsersConsumer);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
