import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ExamPrepService } from '../services/exam-prep.service';

export class ExamPrepController {
  static async getProfiles(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const profiles = await ExamPrepService.getProfiles(userId);

      res.status(200).json({
        success: true,
        data: profiles,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch exam profiles',
      });
    }
  }

  static async createProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { examName, examCode, examCategory, targetExamDate, targetScore, targetPercentile, strategyPhases } = req.body;

      if (!examName || !examCategory || !targetExamDate || !targetScore || !targetPercentile) {
        res.status(400).json({
          success: false,
          message: 'examName, examCategory, targetExamDate, targetScore, and targetPercentile are required',
        });
        return;
      }

      const profile = await ExamPrepService.createProfile(userId, {
        examName,
        examCode,
        examCategory,
        targetExamDate,
        targetScore,
        targetPercentile,
        strategyPhases,
      });

      res.status(201).json({
        success: true,
        message: 'Exam profile created successfully',
        data: profile,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create exam profile',
      });
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      const updated = await ExamPrepService.updateProfile(userId, id, req.body);

      res.status(200).json({
        success: true,
        message: 'Exam profile updated successfully',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to update exam profile',
      });
    }
  }

  static async toggleMilestone(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id, milestoneId } = req.params;

      const updated = await ExamPrepService.toggleMilestone(userId, id, milestoneId);

      res.status(200).json({
        success: true,
        message: 'Milestone updated! +25 XP earned',
        data: updated,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to toggle milestone',
      });
    }
  }

  static async deleteProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { id } = req.params;

      await ExamPrepService.deleteProfile(userId, id);

      res.status(200).json({
        success: true,
        message: 'Exam profile deleted successfully',
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to delete exam profile',
      });
    }
  }
}
