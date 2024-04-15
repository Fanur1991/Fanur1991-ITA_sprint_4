// Import necessary classes and utilities.
import { Task } from '../../core/domain/entities/Task';
import { TaskRepository } from '../../core/repositories/taskRepository';
import { getFullDate } from '../../utils/getFullDate';

// Define the InMemoryTaskRepository class that implements the TaskRepository interface for managing tasks in-memory.
export class InMemoryTaskRepository implements TaskRepository {
  private tasksList: Task[] = []; // Initialize an empty array to store tasks.

  getTasks(): Task[] {
    // Return the list of all tasks.
    return this.tasksList;
  }

  addTask(task: Task): Task {
    // Add a new task to the tasks list and return the task.
    this.tasksList.push(task);
    return task;
  }

  changeTaskState(id: string): Task | null {
    // Find the task by ID and toggle its state. Update the 'updatedAt' field if task exists.
    const task = this.tasksList.find((task) => task.id === id);

    if (task) {
      task.state = !task.state; // Toggle the state of the task.
      task.updatedAt = getFullDate(); // Update the task's updatedAt field.
      return task;
    }

    return null; // Return null if no task found.
  }

  deleteTask(id: string): boolean {
    // Remove a task by ID from the tasks list. Return true if successful, or false if task not found.
    const index = this.tasksList.findIndex((task) => task.id === id);
    if (index === -1) {
      return false; // Return false if no task was found with the given ID.
    }
    this.tasksList.splice(index, 1); // Remove the task from the list.
    return true;
  }
}
