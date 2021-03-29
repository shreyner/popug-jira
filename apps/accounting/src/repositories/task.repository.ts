import { EntityRepository } from '@mikro-orm/postgresql';
import { Task } from '../entities';

export class TaskRepository extends EntityRepository<Task> {}
