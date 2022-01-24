import { join } from 'node:path';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrmModule } from './modules/orm/orm.module';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '..', '..', '..', '.accounting.env'),
      isGlobal: true,
    }),
    PassportModule.register({
      defaultStrategy: 'oauth2',
      session: true,
    }),
    AuthModule,
    UsersModule,
    OrmModule,
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
