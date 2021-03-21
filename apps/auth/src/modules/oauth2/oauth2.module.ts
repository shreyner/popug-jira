import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AccessToken, AuthorizationCode, RefreshToken } from '../../entities';
import { Oauth2Controller } from './oauth2.controller';
import { Oauth2Service } from './oauth2.service';
import { AuthorizationCodeService } from './authorization-code/authorization-code.service';
import { UsersModule } from '../users/users.module';
import { ClientsModule } from '../clients/clients.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([AccessToken, RefreshToken, AuthorizationCode]),
    UsersModule,
    ClientsModule,
    AuthModule,
  ],
  controllers: [Oauth2Controller],
  providers: [Oauth2Service, AuthorizationCodeService],
})
export class Oauth2Module {}
