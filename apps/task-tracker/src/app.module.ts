import { join } from 'node:path';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrmModule } from './modules/orm/orm.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MessageBusModule } from './modules/message-bus/message-bus.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '..', '..', '.task-tracker.env'),
      isGlobal: true,
    }),
    PassportModule.register({
      defaultStrategy: 'oauth2',
      session: true,
    }),
    OrmModule,
    TasksModule,
    AuthModule,
    UsersModule,
    MessageBusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
