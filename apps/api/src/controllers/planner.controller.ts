import { Response, NextFunction } from 'express';
import { PlannerService } from '../services/planner.service';
import { ApiResponse, StudyTask, WeeklyScheduleData } from '@studentlife/shared';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class PlannerController {
  static async getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { status, priority, date } = req.query as any;

      const tasks = await PlannerService.getTasks(userId, { status, priority, date });
      const response: ApiResponse<StudyTask[]> = {
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const task = await PlannerService.createTask(userId, req.body);

      const response: ApiResponse<StudyTask> = {
        success: true,
        message: 'Study task created successfully!',
        data: task,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id;
      const task = await PlannerService.updateTask(userId, taskId, req.body);

      const response: ApiResponse<StudyTask> = {
        success: true,
        message: 'Study task updated successfully',
        data: task,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async toggleTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id;
      const result = await PlannerService.toggleTask(userId, taskId);

      const response: ApiResponse<{ task: StudyTask; xpEarned: number }> = {
        success: true,
        message: result.xpEarned > 0 ? `Task completed! +${result.xpEarned} XP earned 🎯` : 'Task marked as pending',
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const taskId = req.params.id;
      await PlannerService.deleteTask(userId, taskId);

      const response: ApiResponse = {
        success: true,
        message: 'Task deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async getWeeklySchedule(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const schedule = await PlannerService.getWeeklySchedule(userId);

      const response: ApiResponse<WeeklyScheduleData[]> = {
        success: true,
        message: 'Weekly schedule retrieved successfully',
        data: schedule,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
