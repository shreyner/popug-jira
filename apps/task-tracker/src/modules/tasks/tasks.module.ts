import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Task, User } from '../../entities';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MessageBusModule } from '../message-bus/message-bus.module';

@Module({
  imports: [MikroOrmModule.forFeature([Task, User]), MessageBusModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
