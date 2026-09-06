import { Response, NextFunction } from 'express';
import { SyllabusService } from '../services/syllabus.service';
import { ApiResponse, SubjectWithTopics, SyllabusOverviewStats, TopicItem } from '@studentlife/shared';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class SyllabusController {
  static async getSubjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const subjects = await SyllabusService.getSubjects(userId);

      const response: ApiResponse<SubjectWithTopics[]> = {
        success: true,
        message: 'Subjects and syllabus tree retrieved successfully',
        data: subjects,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async createSubject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const subject = await SyllabusService.createSubject(userId, req.body);

      const response: ApiResponse<SubjectWithTopics> = {
        success: true,
        message: 'Subject added to syllabus successfully!',
        data: subject,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async addTopic(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const subjectId = req.params.subjectId;
      const topic = await SyllabusService.addTopic(userId, subjectId, req.body);

      const response: ApiResponse<TopicItem> = {
        success: true,
        message: 'Topic added successfully',
        data: topic,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async toggleTopic(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const topicId = req.params.topicId;
      const result = await SyllabusService.toggleTopic(userId, topicId);

      const response: ApiResponse<{ topic: TopicItem; subject: SubjectWithTopics; xpEarned: number }> = {
        success: true,
        message: result.xpEarned > 0 ? `Topic completed! +${result.xpEarned} XP awarded 🎯` : 'Topic marked as pending',
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async deleteTopic(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const topicId = req.params.topicId;
      await SyllabusService.deleteTopic(userId, topicId);

      const response: ApiResponse = {
        success: true,
        message: 'Topic deleted successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async getOverview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const overview = await SyllabusService.getOverview(userId);

      const response: ApiResponse<SyllabusOverviewStats> = {
        success: true,
        message: 'Syllabus overview statistics retrieved successfully',
        data: overview,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
