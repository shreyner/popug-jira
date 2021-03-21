import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { Client } from '../../entities';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(
    @Inject(ClientsService)
    private readonly clientsService: ClientsService,
  ) {}

  @Get()
  getAll(): Promise<Client[]> {
    return this.clientsService.getAll();
  }

  @Post()
  addClient(@Body() createClinetDto: CreateClientDto): Promise<Client> {
    return this.clientsService.createClient(createClinetDto);
  }

  @Get(':clientId')
  async getByClientId(@Param('clientId') clientId: string): Promise<Client> {
    if (!clientId) {
      throw new BadRequestException();
    }

    const client = await this.clientsService.findByClientId(clientId);

    if (!client) {
      throw new NotFoundException();
    }

    return client;
  }
}
