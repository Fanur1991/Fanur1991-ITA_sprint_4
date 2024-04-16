import express, { Express, Response, Request } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';

// Mock the uuid module to return a fixed value for consistent testing.
jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));
// Mock the InMemoryTaskRepository to control its behavior for tests.
jest.mock(
  '../../../../infrastructure/repositories/InMemoryTaskRepository',
  () => {
    return {
      InMemoryTaskRepository: jest.fn().mockImplementation(() => {
        return {
          getTasks: jest.fn().mockImplementation(() => []),
        };
      }),
    };
  }
);

describe('GET /api/tasks', () => {
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
    // Setup the /api/tasks route to use the taskController's fetchTasks method.
    app.get('/api/tasks', (req: Request, res: Response) =>
      taskController.fetchTasks(req, res)
    );
  });

  test('should return an array of tasks if they exist', async () => {
    const mockTasks = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Learn Docker',
        state: false,
        createdAt: '2024-04-15 17:00',
        updatedAt: '2024-04-15 17:00',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Do not forgot to eat',
        state: true,
        createdAt: '2024-04-15 17:00',
        updatedAt: '2024-04-15 17:00',
      },
    ];

    // Override the getAllTasks method to return mock tasks.
    taskService.getAllTasks = jest.fn().mockReturnValue(mockTasks);

    const response = await request(app).get('/api/tasks').auth('user', '12345');

    expect(response.statusCode).toBe(200); // Expect a 200 OK response.
    // Check if the response body contains the mock tasks.
    expect(response.body.data).toEqual(mockTasks);
  });

  test('should return a message indicating an empty list if no tasks exist', async () => {
    taskService.getAllTasks = jest.fn().mockReturnValue([]); // No tasks returned.

    const response = await request(app).get('/api/tasks').auth('user', '12345');

    expect(response.statusCode).toBe(200); // Expect a 200 OK response.
    // Check if the message about empty todo list is correct.
    expect(response.body).toEqual({ message: 'Todo list is empty' });
  });

  test('should handle server errors and return 500', async () => {
    // Simulate a server error by throwing an exception.
    taskService.getAllTasks = jest.fn().mockImplementation(() => {
      throw new Error('Internal server error');
    });

    const response = await request(app).get('/api/tasks').auth('user', '12345');

    // Expect a 500 Internal Server Error response.
    expect(response.statusCode).toBe(500);
    // Check the response text for the error message.
    expect(response.text).toContain('Internal Server Error');
  });
});
