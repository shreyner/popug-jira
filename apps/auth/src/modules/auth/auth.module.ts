import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategy/local.strategy';
import { AuthController } from './auth.controller';
import { BearerStrategy } from './strategy/bearer.strategy';
import { SessionSerializer } from './session.serializer';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [UsersModule, PassportModule, TokensModule],
  providers: [AuthService, LocalStrategy, SessionSerializer, BearerStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
