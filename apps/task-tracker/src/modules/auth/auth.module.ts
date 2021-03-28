import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AuthController } from './auth.controller';
import { OauthStrategy } from './strategy/oauth.strategy';
import { SessionSerializer } from './session.serializer';
import { UsersModule } from '../users/users.module';
import { User } from '../../entities';

@Module({
  imports: [PassportModule, UsersModule, MikroOrmModule.forFeature([User])],
  providers: [OauthStrategy, SessionSerializer],
  controllers: [AuthController],
})
export class AuthModule {}
