import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AccessTokenService } from './access-token/access-token.service';
import { AccessToken, RefreshToken } from '../../entities';

@Module({
  imports: [MikroOrmModule.forFeature([AccessToken, RefreshToken])],
  providers: [AccessTokenService],
  exports: [AccessTokenService],
})
export class TokensModule {}
