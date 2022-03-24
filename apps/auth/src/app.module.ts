import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { Oauth2Module } from './modules/oauth2/oauth2.module';
import { OrmModule } from './modules/orm/orm.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { MessageBusModule } from './modules/message-bus/message-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '..', '..', '.auth.env'),
      isGlobal: true,
    }),
    // PassportModule.register({
    //   defaultStrategy: 'local',
    //   session: true,
    // }),
    UsersModule,
    AuthModule,
    Oauth2Module,
    OrmModule,
    ClientsModule,
    ProfilesModule,
    TokensModule,
    MessageBusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
