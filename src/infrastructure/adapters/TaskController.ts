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

      // Return an empty todo list message if no tasks found.
      if (fetchedTaskList.length === 0) {
        res.status(200).json({ message: 'Todo list is empty' });
        return;
      }

      // Send the list of tasks if tasks exist.
      res.status(200).json({ data: fetchedTaskList });
      return;
    } catch (err) {
      // Handle any server error during the fetch operation.
      res.status(500).send('Internal Server Error');
    }
  }

  public addTask(req: Request, res: Response): void {
    try {
      const { title } = req.body;

      // Ensure title is provided for creating a task.
      if (!title) {
        res.status(400).json({ message: 'Input task title' });
        return;
      }

      const addTaskDTO = new AddTaskDTO(title);
      const taskDTO = this.taskService.createTask(addTaskDTO.title);

      // Respond with the newly created task data.
      res.status(201).json({
        data: taskDTO,
      });
      return;
    } catch (error) {
      // Handle errors during the task creation process.
      res.status(500).send('Error while creating task');
    }
  }

  public changeTaskState(req: Request, res: Response): void {
    try {
      const { id } = req.params;

      console.log(id);

      const parsedId = parseInt(id);

      // Validate the task ID format.
      if (isNaN(parsedId)) {
        res.status(400).json({
          message: 'Invalid task ID format',
        });
        return;
      }
      const changeTaskStateDTO = new ChangeTaskStateDTO(parsedId);
      const changedTaskStateDTO = this.taskService.changeTaskState(
        changeTaskStateDTO.id
      );

      if (!changedTaskStateDTO) {
        // Handle the case where the task is not found.
        res.status(404).json({
          message: 'Task not found',
        });
        return;
      }

      // Respond with the updated task data.
      res.status(200).json({ data: changedTaskStateDTO });
      return;
    } catch (error) {
      // Handle any server error during the task state change operation.
      res.status(500).json({
        message: 'Error while updating task',
      });
    }
  }

  public deleteTask(req: Request, res: Response): void {
    try {
      const { id } = req.params;

      const parsedId = parseInt(id);
      // Validate the task ID format before proceeding with deletion.
      if (isNaN(parsedId)) {
        res.status(400).json({
          message: 'Invalid task ID format',
        });
        return;
      }

      const deleteTaskDTO = new DeleteTaskDTO(parsedId);
      const deletedTaskDTO = this.taskService.deleteTask(deleteTaskDTO.id);

      // Check if the task was successfully deleted or not found.
      if (!deletedTaskDTO) {
        res.status(404).json({
          message: 'Task not found or could not be deleted',
        });
        return;
      }

      // Confirm successful deletion of the task.
      res.status(202).json({ message: 'Task successfully deleted' });
      return;
    } catch (error) {
      // Handle any server error during the task deletion process.
      res.status(500).send('Error while deleting task');
    }
  }
}
