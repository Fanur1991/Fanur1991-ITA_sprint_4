import express, { Express, Request, Response } from 'express';
import request from 'supertest';
import { TaskController } from '../../../../infrastructure/adapters/TaskController';
import { TaskService } from '../../../../application/services/TaskService';
import { InMemoryTaskRepository } from '../../../../infrastructure/repositories/InMemoryTaskRepository';
import { Task } from '../../../../core/domain/entities/Task';

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
          getTasks: jest.fn().mockImplementation(() => []),
          addTask: jest.fn().mockImplementation((task) => {
            tasks.push(task);
            return task;
          }),
          deleteTask: jest.fn().mockImplementation((id) => {
            const index = tasks.findIndex((t) => t.id === id);
            if (index !== -1) {
              tasks.splice(index, 1);
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
    app.use(express.json());
    taskRepository = new InMemoryTaskRepository();
    taskService = new TaskService(taskRepository);
    taskController = new TaskController(taskService);
    app.delete('/api/tasks/:id', (req: Request, res: Response) =>
      taskController.deleteTask(req, res)
    );
  });

  test('должен успешно удалить задачу и вернуть 202 статус', async () => {
    const newTask = {
      title: 'Learn DDD',
      id: '123e4567-e89b-12d3-a456-426614174000',
      state: false,
      createdAt: '2024-04-15 17:00',
      updatedAt: '2024-04-15 17:00',
    };
    taskRepository.addTask(newTask);

    const response = await request(app)
      .delete(`/api/tasks/${newTask.id}`)
      .auth('user', '12345');

    expect(response.statusCode).toBe(202);
    expect(response.body.message).toEqual('Task successfully deleted');
    expect(taskRepository.deleteTask).toHaveBeenCalledWith(newTask.id);
    expect(taskRepository.getTasks()).not.toContainEqual(newTask);
  });

  test('должен возвращать 404, если задача не найдена', async () => {
    const response = await request(app)
      .delete('/api/tasks/12345')
      .auth('user', '12345');

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual(
      'Task not found or could not be deleted'
    );
  });

  test('должен обрабатывать ошибки сервера и возвращать 500', async () => {
    taskService.deleteTask = jest.fn().mockImplementation(() => {
      throw new Error('Server error');
    });

    const response = await request(app)
      .delete('/api/tasks/1')
      .auth('user', '12345');

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toContain('Error while deleting task');
  });
});
