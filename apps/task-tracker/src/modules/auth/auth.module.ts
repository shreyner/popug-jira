import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { OauthStrategy } from './strategy/oauth.strategy';
import { SessionSerializer } from './session.serializer';

@Module({
  imports: [PassportModule],
  providers: [AuthService, OauthStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
