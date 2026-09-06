import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { performanceService } from '../services/performance.service';

export class PerformanceController {
  static async getSummary(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const summary = performanceService.getAnalyticsSummary(userId);

      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch performance analytics summary',
      });
    }
  }

  static async getWeakAreas(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const weakAreas = performanceService.getWeakAreas(userId);

      res.status(200).json({
        success: true,
        data: weakAreas,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch weak area diagnostics',
      });
    }
  }
}
