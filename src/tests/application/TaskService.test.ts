import { TaskService } from '../../application/services/TaskService';
import { TaskRepository } from '../../core/repositories/taskRepository';
import { Task } from '../../core/domain/entities/Task';
import { getFullDate } from '../../utils/getFullDate';

jest.mock('uuid', () => ({
  v4: jest.fn(() => '123e4567-e89b-12d3-a456-426614174000'),
}));
// Mock the getFullDate utility to ensure consistent date values during tests.
jest.mock('../../utils/getFullDate');

// Group tests for the TaskService.
describe('TaskService', () => {
  let taskService: TaskService;
  let mockTaskRepository: jest.Mocked<TaskRepository>;

  // Setup a new TaskService and mock repository before each test.
  beforeEach(() => {
    // Create a mocked version of the TaskRepository with predefined behaviorsю
    mockTaskRepository = {
      getTasks: jest.fn().mockReturnValue([]),
      addTask: jest.fn(),
      changeTaskState: jest.fn(),
      deleteTask: jest.fn(),
    };

    taskService = new TaskService(mockTaskRepository);
    // Set a fixed return value for getFullDate to control test environment.
    (getFullDate as jest.Mock).mockReturnValue('2024-04-15 17:00');
  });

  // Tests for retrieving tasks.
  test('getAllTasks should return empty array', () => {
    // Expecting an empty array when the repository is empty.
    expect(taskService.getAllTasks()).toEqual([]);
  });

  test('getAllTasks should return an array of tasks', () => {
    const tasks: Task[] = [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Learn TDD',
        state: false,
        createdAt: '2024-04-15 17:00',
        updatedAt: '2024-04-15 17:00',
      },
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        title: 'Learn Express.js',
        state: true,
        createdAt: '2024-04-15 17:00',
        updatedAt: '2024-04-15 17:00',
      },
    ];
    mockTaskRepository.getTasks.mockReturnValue(tasks); // Mock response with tasks.
    expect(taskService.getAllTasks()).toEqual(tasks); // Check if the service returns the exact mocked tasks.
  });

  // Tests for creating a new task.
  test('createTask should add a new task and return it', () => {
    const newTask: Task = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Learn Node.js',
      state: false,
      createdAt: '2024-04-15 17:00',
      updatedAt: '2024-04-15 17:00',
    };
    // Ensure that addTask returns the new task.
    mockTaskRepository.addTask.mockReturnValue(newTask);
    // Test if the service correctly creates and returns a new task
    expect(taskService.createTask('Learn Node.js')).toEqual(newTask);
    // Confirm that addTask was called with the correct task.
    expect(mockTaskRepository.addTask).toHaveBeenCalledWith({
      ...newTask,
      title: 'Learn Node.js',
    });
  });

  // Tests for changing the state of an existing task.
  test('changeTaskState should modify the state of an existing task', () => {
    const task: Task = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'To complete the sprint 4',
      state: false,
      createdAt: '2024-04-15 17:00',
      updatedAt: '2024-04-15 17:00',
    };

    // Mock updated task with state toggled.
    const updatedTask: Task = { ...task, state: true };
    // Mock the changeTaskState response.
    mockTaskRepository.changeTaskState.mockReturnValue(updatedTask);
    // Check if the service updates and returns the task correctly.
    expect(
      taskService.changeTaskState('123e4567-e89b-12d3-a456-426614174000')
    ).toEqual(updatedTask);
  });

  test('changeTaskState should handle non-existing task', () => {
    // Mock a non-existent task scenario.
    mockTaskRepository.changeTaskState.mockReturnValue(null);
    // Verify that the service correctly handles non-existing tasks.
    expect(taskService.changeTaskState('12345')).toBeNull();
  });

  // Tests for deleting a task.
  test('deleteTask should return true when a task is successfully deleted', () => {
    // Mock successful deletion.
    mockTaskRepository.deleteTask.mockReturnValue(true);
    // Confirm the service returns true on successful deletion.
    expect(taskService.deleteTask('123e4567-e89b-12d3-a456-426614174000')).toBe(
      true
    );
  });

  test('deleteTask should handle deletion of non-existing task', () => {
    // Mock failure in deletion.
    mockTaskRepository.deleteTask.mockReturnValue(false);
    // Check if the service properly handles deletion failures.
    expect(taskService.deleteTask('12345')).toBe(false);
  });
});
