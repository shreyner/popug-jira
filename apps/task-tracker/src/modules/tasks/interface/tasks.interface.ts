import { TaskState } from '../enum/task-status.enum';

export interface TaskInterface {
  description: string;
  state: TaskState;
}
