import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';

jest.mock(
  '../../../../infrastructure/repositories/InMemoryTaskRepository',
  () => {
    return {
      InMemoryTaskRepository: jest.fn().mockImplementation(() => {
        let tasks = [];
        return {
          addTask: jest.fn().mockImplementation((task) => {
            tasks.push(task);
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
    app.use(express.json());
    taskRepository = new InMemoryTaskRepository();
    taskService = new TaskService(taskRepository);
    taskController = new TaskController(taskService);
    app.post('/api/tasks', (req: Request, res: Response) =>
      taskController.addTask(req, res)
    );
  });

  test('должен успешно добавить задачу и вернуть 201 статус', async () => {
    const newTask = { title: 'Learn Jest' };
    const response = await request(app)
      .post('/api/tasks')
      .auth('user', '12345')
      .set('Content-Type', 'application/json')
      .send(newTask);

    expect(response.statusCode).toBe(201);
    expect(response.body.data).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Learn Jest',
        state: false,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );
  });

  test('должен возвращать 400, если название задачи не предоставлено', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({})
      .auth('user', '12345');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Input task title');
  });

  test('должен обрабатывать ошибки сервера и возвращать 500', async () => {
    const newTask = { title: 'Error Task' };
    taskService.createTask = jest.fn().mockImplementation(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .post('/api/tasks')
      .send(newTask)
      .auth('user', '12345');

    expect(response.statusCode).toBe(500);
    expect(response.text).toContain('Failed to create task object');
  });
});
