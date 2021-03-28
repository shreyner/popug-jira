import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersConsumer } from './users.consumer';
import { User } from '../../entities';

@Module({
  imports: [MikroOrmModule.forFeature([User])],
  providers: [UsersService, UsersConsumer],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
