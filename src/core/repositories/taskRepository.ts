import { Task } from '../domain/entities/Task';

export interface TaskRepository {
  getTasks(): Task[];
  addTask(task: Task): Task;
  changeTaskState(id: string): Task | null;
  deleteTask(id: string): boolean;
}
