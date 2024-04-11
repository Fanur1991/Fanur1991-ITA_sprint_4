import { TaskRepository } from '../../core/repositories/taskRepository';
import { Task } from '../../core/domain/entities/Task';
import { getFullDate } from '../../utils/getFullDate';

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  getAllTasks(): Task[] {
    return this.taskRepository.getTasks();
  }

  createTask(title: string): Task {
    const task: Task = {
      id: Date.now(),
      title,
      state: false,
      createdAt: getFullDate(),
    };
    return this.taskRepository.addTask(task);
  }

  changeTaskState(id: number): Task | string {
    return this.taskRepository.changeTaskState(id);
  }

  deleteTask(id: number): string {
    return this.taskRepository.deleteTask(id);
  }
}
