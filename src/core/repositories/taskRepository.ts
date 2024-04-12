import { Task } from '../domain/entities/Task';

export interface TaskRepository {
  getTasks(): Task[];
  addTask(task: Task): Task;
  changeTaskState(id: number): Task;
  deleteTask(id: number): string;
}
