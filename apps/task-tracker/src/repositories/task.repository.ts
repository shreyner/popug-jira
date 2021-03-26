import { EntityRepository } from '@mikro-orm/postgresql';
import { Task } from '../entities';
import { TaskState } from '../modules/tasks/enum/task-status.enum';

export class TaskRepository extends EntityRepository<Task> {
  getOpen(): Promise<Task[]> {
    return this.find({
      state: TaskState.Open,
    });
  }
}
