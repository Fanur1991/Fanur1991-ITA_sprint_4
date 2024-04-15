import { TaskRepository } from '../../core/repositories/taskRepository';
import { Task } from '../../core/domain/entities/Task';
import { getFullDate } from '../../utils/getFullDate';

export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  // Method to retrieve all tasks from the repository.
  getAllTasks(): Task[] {
    return this.taskRepository.getTasks();
  }

  // Method to create a new task with the provided title and default values for other properties.
  createTask(title: string): Task {
    const task: Task = {
      id: Date.now(),
      title,
      state: false,
      createdAt: getFullDate(),
      updatedAt: getFullDate(),
    };
    return this.taskRepository.addTask(task);
  }

  // Method to change the state of a specific task by its ID.
  changeTaskState(id: number): Task | null {
    return this.taskRepository.changeTaskState(id);
  }

  // Method to delete a task by its ID and return a boolean indicating success.
  deleteTask(id: number): boolean {
    return this.taskRepository.deleteTask(id);
  }
}
