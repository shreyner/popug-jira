import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../../entities';
import { UsersController } from './users.controller';
import { UsersConsumer } from './users.consumer';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersService, UsersConsumer],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
