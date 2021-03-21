import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClientsService } from './clients.service';
import { Client } from '../../entities';
import { ClientsController } from './clients.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Client])],
  providers: [ClientsService],
  exports: [ClientsService],
  controllers: [ClientsController],
})
export class ClientsModule {}
