import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';
import { Task } from '../../../../core/domain/entities/Task';

// Mock UUID generation for consistent ID creation.
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));
// Mock the InMemoryTaskRepository to control its behavior for tests.
jest.mock(
  '../../../../infrastructure/repositories/InMemoryTaskRepository',
  () => {
    return {
      InMemoryTaskRepository: jest.fn().mockImplementation(() => {
        let tasks: Task[] = []; // Local store to keep tasks.
        return {
          getTasks: jest.fn().mockImplementation(() => []),
          addTask: jest.fn().mockImplementation((task) => {
            tasks.push(task); // Mimic adding task to a repository.
            return task;
          }),
          deleteTask: jest.fn().mockImplementation((id) => {
            const index = tasks.findIndex((t) => t.id === id);
            if (index !== -1) {
              tasks.splice(index, 1); // Simulate task deletion
              return true;
            }
            return false;
          }),
        };
      }),
    };
  }
);

describe('DELETE /api/tasks/:id', () => {
  let app: Express;
  let taskController: TaskController;
  let taskService: TaskService;
  let taskRepository: InMemoryTaskRepository;

  beforeEach(() => {
    app = express();
    app.use(express.json()); // Middleware to parse JSON bodies.
    taskRepository = new InMemoryTaskRepository();
    taskService = new TaskService(taskRepository);
    taskController = new TaskController(taskService);
    app.delete('/api/tasks/:id', (req: Request, res: Response) =>
      taskController.deleteTask(req, res)
    );
  });

  test('дshould successfully delete a task and return 202 status', async () => {
    // Add a task that will be deleted in the test
    const newTask = {
      title: 'Learn DDD',
      id: '123e4567-e89b-12d3-a456-426614174000',
      state: false,
      createdAt: '2024-04-15 17:00',
      updatedAt: '2024-04-15 17:00',
    };

    // Manually adding a task to simulate existing data
    taskRepository.addTask(newTask);

    const response = await request(app)
      .delete(`/api/tasks/${newTask.id}`)
      .auth('user', '12345');

    // Check for the expected success status code
    expect(response.statusCode).toBe(202);
    // Verify the success message
    expect(response.body.message).toEqual('Task successfully deleted');
    // Ensure the delete function was called
    expect(taskRepository.deleteTask).toHaveBeenCalledWith(newTask.id);
    // Confirm the task is no longer in the repository
    expect(taskRepository.getTasks()).not.toContainEqual(newTask);
  });

  test('should return 404 if the task is not found', async () => {
    const response = await request(app)
      .delete('/api/tasks/12345')
      .auth('user', '12345');

    expect(response.statusCode).toBe(404); // Check for the "Not Found" status code
    // Confirm the appropriate error message is returned
    expect(response.body.message).toEqual(
      'Task not found or could not be deleted'
    );
  });

  test('should handle server errors and return 500', async () => {
    taskService.deleteTask = jest.fn().mockImplementation(() => {
      throw new Error('Server error'); // Force an error to simulate server failure
    });

    const response = await request(app)
      .delete('/api/tasks/1')
      .auth('user', '12345');

    // Expect a server error status code
    expect(response.statusCode).toBe(500);
    // Verify that the error message indicates a server issue
    expect(response.body.message).toContain('Error while deleting task');
  });
});
