import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';
import { Task } from '../../../../core/domain/entities/Task';
import { getFullDate } from '../../../../utils/getFullDate';

jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));
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
              task.state = !task.state;
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
    app.use(express.json());
    taskRepository = new InMemoryTaskRepository();
    taskService = new TaskService(taskRepository);
    taskController = new TaskController(taskService);
    app.patch('/api/tasks/:id', (req: Request, res: Response) =>
      taskController.changeTaskState(req, res)
    );
  });

  test('должен успешно изменить статус задачи и вернуть 200 статус', async () => {
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

    expect(response.statusCode).toBe(200);
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

  test('должен возвращать 404, если задача не найдена', async () => {
    const response = await request(app)
      .patch('/api/tasks/12345')
      .auth('user', '12345');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Task not found');
  });

  test('должен обрабатывать ошибки сервера и возвращать 500', async () => {
    taskService.changeTaskState = jest.fn().mockImplementation(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .patch('/api/tasks/1')
      .auth('user', '12345');

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toContain('Error while updating task');
  });
});
