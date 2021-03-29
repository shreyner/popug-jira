import { Test, TestingModule } from '@nestjs/testing';
import { TasksConsumer } from './tasks.consumer';

describe('TasksConsumer', () => {
  let provider: TasksConsumer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksConsumer],
    }).compile();

    provider = module.get<TasksConsumer>(TasksConsumer);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
