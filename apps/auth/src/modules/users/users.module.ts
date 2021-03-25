import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersService } from './users.service';
import { User } from '../../entities';
import { UsersController } from './users.controller';
import { MessageBusModule } from '../message-bus/message-bus.module';

@Module({
  imports: [MessageBusModule, MikroOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
