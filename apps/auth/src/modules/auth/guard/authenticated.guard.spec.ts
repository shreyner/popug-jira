import { AuthenticatedGuard } from './authenticated.guard';

describe('AuthenticatedGuardGuard', () => {
  it('should be defined', () => {
    expect(new AuthenticatedGuard()).toBeDefined();
  });
});
