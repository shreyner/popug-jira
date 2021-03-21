import { Test, TestingModule } from '@nestjs/testing';
import { OauthStrategy } from './oauth.strategy';

describe('OauthStrategy', () => {
  let provider: OauthStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthStrategy],
    }).compile();

    provider = module.get<OauthStrategy>(OauthStrategy);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
