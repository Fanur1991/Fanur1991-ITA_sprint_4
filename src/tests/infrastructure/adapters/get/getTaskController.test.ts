import express, { Express, Response, Request } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';

jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));
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
    app.use(express.json());
    taskRepository = new InMemoryTaskRepository();
    taskService = new TaskService(taskRepository);
    taskController = new TaskController(taskService);
    app.get('/api/tasks', (req: Request, res: Response) =>
      taskController.fetchTasks(req, res)
    );
  });

  test('должен вернуть массив задач, если они есть', async () => {
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

    taskService.getAllTasks = jest.fn().mockReturnValue(mockTasks);

    const response = await request(app).get('/api/tasks').auth('user', '12345');

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toEqual(mockTasks);
  });

  test('должен вернуть сообщение о пустом списке, если задач нет', async () => {
    taskService.getAllTasks = jest.fn().mockReturnValue([]);

    const response = await request(app).get('/api/tasks').auth('user', '12345');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'Todo list is empty' });
  });

  test('должен обрабатывать ошибки сервера и возвращать 500', async () => {
    taskService.getAllTasks = jest.fn().mockImplementation(() => {
      throw new Error('Internal server error');
    });

    const response = await request(app).get('/api/tasks').auth('user', '12345');

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain('Internal Server Error');
  });
});
