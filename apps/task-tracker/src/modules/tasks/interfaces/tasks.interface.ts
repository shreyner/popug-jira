export enum TaskState {
  Open = 'open',
  Close = 'close',
}

export interface ITask {
  description: string;
  state: TaskState;
}
