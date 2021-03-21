import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Client } from '../../entities';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: EntityRepository<Client>,
  ) {}

  private generateString() {
    const randomBite = crypto.randomBytes(32);

    return Buffer.from(randomBite).toString('hex');
  }

  async createClient({
    isTrusted,
    name,
    redirectUrl,
  }: {
    name: string;
    redirectUrl: string;
    isTrusted?: boolean;
  }): Promise<Client> {
    const clientId = this.generateString();
    const clientSecret = this.generateString();

    const client = new Client({
      clientId,
      clientSecret,
      name,
      isTrusted,
      redirectUrl,
    });

    await this.clientRepository.persistAndFlush(client);

    return client;
  }

  getAll(): Promise<Client[]> {
    return this.clientRepository.findAll();
  }

  findByClientId(clientId: string): Promise<Client | null> {
    return this.clientRepository.findOne({ clientId });
  }
}
