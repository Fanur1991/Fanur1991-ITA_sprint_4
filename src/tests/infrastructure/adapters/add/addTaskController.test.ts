import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';

// Mock the InMemoryTaskRepository to control its behavior for tests.
jest.mock(
  '../../../../infrastructure/repositories/InMemoryTaskRepository',
  () => {
    return {
      InMemoryTaskRepository: jest.fn().mockImplementation(() => {
        let tasks = []; // Local store to keep tasks.
        return {
          addTask: jest.fn().mockImplementation((task) => {
            tasks.push(task); // Mimic adding task to a repository.
            return task;
          }),
        };
      }),
    };
  }
);

describe('POST /api/tasks', () => {
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
    // Set up POST endpoint to handle task creation.
    app.post('/api/tasks', (req: Request, res: Response) =>
      taskController.addTask(req, res)
    );
  });

  test('should successfully add a task and return 201 status', async () => {
    const newTask = { title: 'Learn Jest' }; // Define a new task.
    const response = await request(app)
      .post('/api/tasks')
      .auth('user', '12345') // Basic auth for security.
      .set('Content-Type', 'application/json') // Set headers to accept JSON.
      .send(newTask); // Send the new task as payload.

    expect(response.statusCode).toBe(201); // Check for HTTP 201 (Created).
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String), // Ensure an ID was assigned.
        title: 'Learn Jest', // Match title.
        state: false, // Default state should be false.
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  test('should return 400 if the task title is not provided', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({}) // Send empty object to simulate missing title.
      .auth('user', '12345');

    expect(response.statusCode).toBe(400); // Expect Bad Request status.
    // Check for the correct error message.
    expect(response.body.message).toEqual('Input task title');
  });

  test('should handle server errors and return 500', async () => {
    const newTask = { title: 'Error Task' }; // Task that will trigger an error.
    taskService.createTask = jest.fn().mockImplementation(() => {
      throw new Error('Server error'); // Force an error.
    });

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask) // Send task that causes error.
      .auth('user', '12345'); // Include auth for consistency.

    // Expect Internal Server Error status.
    expect(response.statusCode).toBe(500);
    // Ensure the correct error message is sent.
    expect(response.text).toContain('Failed to create task object');
  });
});
