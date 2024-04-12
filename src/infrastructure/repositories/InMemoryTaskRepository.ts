import { Task } from '../../core/domain/entities/Task';
import { TaskRepository } from '../../core/repositories/taskRepository';
import { getFullDate } from '../../utils/getFullDate';

export class InMemoryTaskRepository implements TaskRepository {
  private tasksList: Task[] = [];

  getTasks(): Task[] {
    return this.tasksList;
  }

  addTask(task: Task): Task {
    this.tasksList.push(task);
    return task;
  }

  changeTaskState(id: number): Task | any {
    const task = this.tasksList.find((task) => task.id === id);

    if (task) {
      task.state = !task.state;
      task.updatedAt = getFullDate();
      return task;
    }
  }

  deleteTask(id: number): string {
    const taskExists = this.tasksList.some((task) => task.id === id);

    if (!taskExists) {
      return 'Task not found';
    }

    this.tasksList = this.tasksList.filter((task) => task.id !== id);

    return 'Task successfully deleted';
  }
}
