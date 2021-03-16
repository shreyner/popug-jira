import { HasBearerAuthGuard } from './has-bearer-auth.guard';

describe('HasBearerAuthGuard', () => {
  it('should be defined', () => {
    expect(new HasBearerAuthGuard()).toBeDefined();
  });
});
