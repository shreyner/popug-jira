import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../entities';
import { AuthController } from './auth.controller';
import { OauthStrategy } from './strategy/oauth.strategy';
import { SessionSerializer } from './session-serializer';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PassportModule, UsersModule, MikroOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [OauthStrategy, SessionSerializer],
})
export class AuthModule {}
