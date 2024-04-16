import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';
import { Task } from '../../../../core/domain/entities/Task';
import { getFullDate } from '../../../../utils/getFullDate';

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
        let tasks: Task[] = [];
        return {
          addTask: jest.fn().mockImplementation((task) => {
            tasks.push(task);
            return task;
          }),
          changeTaskState: jest.fn().mockImplementation((id) => {
            const task = tasks.find((t) => t.id === id);
            if (task) {
              task.state = !task.state; // Update task's state and modification time.
              task.updatedAt = getFullDate();
              return task;
            }
            return null;
          }),
        };
      }),
    };
  }
);

describe('PATCH /api/tasks/:id', () => {
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
    app.patch('/api/tasks/:id', (req: Request, res: Response) =>
      taskController.changeTaskState(req, res)
    );
  });

  test('should successfully change the status of a task and return 200 status', async () => {
    const newTask = { title: 'Learn React' };
    const addedTask = await taskRepository.addTask({
      ...newTask,
      id: '123e4567-e89b-12d3-a456-426614174000',
      state: false,
      createdAt: '2024-04-15 17:00',
      updatedAt: '2024-04-15 17:00',
    });

    const response = await request(app)
      .patch(`/api/tasks/${addedTask.id}`)
      .auth('user', '12345');

    expect(response.statusCode).toBe(200); // Check for HTTP 200 (OK).
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: addedTask.id,
        title: addedTask.title,
        state: true,
        createdAt: addedTask.createdAt,
        updatedAt: addedTask.updatedAt,
      })
    );
  });

  test('should return 404 if the task is not found', async () => {
    const response = await request(app)
      .patch('/api/tasks/12345')
      .auth('user', '12345');

    // Expect "Not Found" status code.
    expect(response.statusCode).toBe(404);
    // Verify error message for clarity.
    expect(response.body.message).toEqual('Task not found');
  });

  test('should handle server errors and return 500', async () => {
    taskService.changeTaskState = jest.fn().mockImplementation(() => {
      throw new Error('Server error'); // Simulate an error.
    });

    const response = await request(app)
      .patch('/api/tasks/1')
      .auth('user', '12345');

    // Check for HTTP 500 (Server Error).
    expect(response.statusCode).toBe(500);
    // Ensure the error message is correct.
    expect(response.body.message).toContain('Error while updating task');
  });
});
