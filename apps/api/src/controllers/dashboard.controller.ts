import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { ApiResponse, DashboardSummaryData } from '@studentlife/shared';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class DashboardController {
  static async getSummary(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const summary = await DashboardService.getSummary(userId);

      const response: ApiResponse<DashboardSummaryData> = {
        success: true,
        message: 'Dashboard summary retrieved successfully',
        data: summary,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async logFocusSession(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { durationMinutes, sessionType } = req.body;

      const result = await DashboardService.logFocusSession(
        userId,
        durationMinutes || 25,
        sessionType || 'FOCUS_25'
      );

      const response: ApiResponse = {
        success: true,
        message: `Focus block recorded! +${result.xpEarned} XP awarded 🎯`,
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}
