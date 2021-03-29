import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Task, TaskPrice, User } from '../../entities';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksConsumer } from './tasks.consumer';

@Module({
  imports: [MikroOrmModule.forFeature([Task, TaskPrice, User])],
  providers: [TasksService, TasksConsumer],
  controllers: [TasksController],
})
export class TasksModule {}
