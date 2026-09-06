import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { mockTestService } from '../services/mock-test.service';

export class MockTestController {
  static async getTemplates(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const templates = mockTestService.getTemplates();
      res.status(200).json({
        success: true,
        data: templates,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch mock test templates',
      });
    }
  }

  static async getTemplateById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const template = mockTestService.getTemplateById(id);

      if (!template) {
        res.status(404).json({
          success: false,
          message: 'Mock test not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: template,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch mock test details',
      });
    }
  }

  static async submitTest(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { mockTestId, timeSpentSeconds, responses } = req.body;

      if (!mockTestId || !responses) {
        res.status(400).json({
          success: false,
          message: 'mockTestId and responses are required',
        });
        return;
      }

      const scorecard = mockTestService.submitTest(userId, {
        mockTestId,
        timeSpentSeconds: timeSpentSeconds || 0,
        responses,
      });

      res.status(200).json({
        success: true,
        message: `Test Submitted! You scored ${scorecard.totalScore} / ${scorecard.maxScore} (+${scorecard.xpEarned} XP)`,
        data: scorecard,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to submit test',
      });
    }
  }

  static async getHistory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const history = mockTestService.getAttemptHistory(userId);

      res.status(200).json({
        success: true,
        data: history,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch attempt history',
      });
    }
  }
}
