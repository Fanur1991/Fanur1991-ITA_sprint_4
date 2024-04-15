// Import required modules and components.
import { Router } from 'express';
import { TaskController } from '../adapters/TaskController';
import { InMemoryTaskRepository } from '../repositories/InMemoryTaskRepository';
import { TaskService } from '../../application/services/TaskService';

// Create instances of the task repository, service, and controller.
const taskRepository = new InMemoryTaskRepository(); // Memory-based repository for tasks.
const taskService = new TaskService(taskRepository); // Service layer to handle business logic.
const taskController = new TaskController(taskService); // Controller to handle API requests.

const router = Router(); // Create a new router object.

// Define API endpoints and bind them to controller methods.
router.get('/tasks', taskController.fetchTasks.bind(taskController)); // Fetch all tasks.
router.post('/tasks', taskController.addTask.bind(taskController)); // Create a new task.
router.patch('/tasks/:id', taskController.changeTaskState.bind(taskController)); // Change the state of a task.
router.delete('/tasks/:id', taskController.deleteTask.bind(taskController)); // Delete a task.

// Export the configured router.
export default router;
