import { Task } from '../../core/domain/entities/Task';
import { TaskRepository } from '../../core/repositories/taskRepository';

export class InMemoryTaskRepository implements TaskRepository {
  private tasksList: Task[] = [];

  getTasks(): Task[] {
    return this.tasksList;
  }

  addTask(task: Task): Task {
    this.tasksList.push(task);
    return task;
  }

  changeTaskState(id: number): Task | null {
    const task = this.tasksList.find((task) => task.id === id);

    if (task) {
      task.state = !task.state;
      return task;
    }
    return null;
  }

  deleteTask(id: number): string {
    let taskTitle = '';
    this.tasksList = this.tasksList.filter((task) => {
      taskTitle = task.title;
      return task.id !== id;
    });
    return `Task ${taskTitle} was deleted`;
  }
}
