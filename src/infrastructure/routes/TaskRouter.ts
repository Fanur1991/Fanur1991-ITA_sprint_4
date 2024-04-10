import { Router } from 'express';
import { TaskController } from '../adapters/TaskController';
import { InMemoryTaskRepository } from '../repositories/InMemoryTaskRepository';
import { TaskService } from '../../application/services/TaskService';

const taskRepository = new InMemoryTaskRepository();
const taskService = new TaskService(taskRepository);
const taskController = new TaskController(taskService);

const router = Router();

router.get('/tasks', taskController.fetchTasks.bind(taskController));
router.post('/tasks', taskController.addTask.bind(taskController));
router.patch('/tasks/:id', taskController.changeTaskState.bind(taskController));
router.delete('/tasks/:id', taskController.deleteTask.bind(taskController));

export default router;
