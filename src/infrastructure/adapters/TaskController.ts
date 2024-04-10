import { Request, Response } from 'express';
import { TaskService } from '../../application/services/TaskService';
import { AddTaskDTO } from '../../application/dto/AddTaskDTO';
import { ChangeTaskStateDTO } from '../../application/dto/ChangeTaskStateDTO';
import { DeleteTaskDTO } from '../../application/dto/DeleteTaskDTO';

export class TaskController {
  constructor(private taskService: TaskService) {}

  public fetchTasks(_req: Request, res: Response): void {
    try {
      const fetchedTaskList = this.taskService.getAllTasks();

      if (fetchedTaskList.length === 0) {
        res.json({ message: 'Todo list is empty' });
      }

      res.status(200).json({ data: fetchedTaskList });
    } catch (err) {
      res.status(500).send('Internal Server Error');
    }
  }

  public addTask(req: Request, res: Response): void {
    try {
      const { title } = req.body;

      if (!title) {
        res.json({ message: 'Input task title' });
      }

      const addTaskDTO = new AddTaskDTO(title);
      const taskDTO = this.taskService.createTask(addTaskDTO.title);

      res.status(200).json({
        data: taskDTO,
      });
    } catch (error) {
      res.status(500).send('Error while creating task');
    }
  }

  public changeTaskState(req: Request, res: Response): void {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(404).json({
          status: 'error',
          message: 'Task not found',
        });
      } else {
        const changeTaskStateDTO = new ChangeTaskStateDTO(parseInt(id));
        const changedTaskStateDTO = this.taskService.changeTaskState(
          changeTaskStateDTO.id
        );

        res.status(200).json({ data: changedTaskStateDTO });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error while updating task',
      });
    }
  }

  public deleteTask(req: Request, res: Response): void {
    try {
      const { id } = req.params;

      if (!id) {
        res.json({ message: 'Invalid ID number' });
      }
      const deleteTaskDTO = new DeleteTaskDTO(parseInt(id));
      const deletedTaskDTO = this.taskService.deleteTask(deleteTaskDTO.id);

      res.status(202).json({ message: deletedTaskDTO });
    } catch (error) {
      res.status(500).send('Error while deleting task');
    }
  }
}
