import { HasLocalAuthGuard } from './has-local-auth.guard';

describe('HasLocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new HasLocalAuthGuard()).toBeDefined();
  });
});
