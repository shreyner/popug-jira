import { EntityRepository } from '@mikro-orm/postgresql';
import { Client } from '../entities';

export class ClientRepository extends EntityRepository<Client> {}
