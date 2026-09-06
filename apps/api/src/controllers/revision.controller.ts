import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { RevisionService } from '../services/revision.service';

export class RevisionController {
  static async getQueue(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const queue = await RevisionService.getQueue(userId);

      res.status(200).json({
        success: true,
        data: queue,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch revision queue',
      });
    }
  }

  static async getStats(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const stats = await RevisionService.getStats(userId);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch revision stats',
      });
    }
  }

  static async reviewItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || 'demo-student-uuid-01';
      const { itemId, rating } = req.body;

      if (!itemId || !rating) {
        res.status(400).json({
          success: false,
          message: 'itemId and rating are required',
        });
        return;
      }

      const result = await RevisionService.reviewItem(userId, { itemId, rating });

      res.status(200).json({
        success: true,
        message: `Revision logged! +${result.xpEarned} XP earned`,
        data: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Failed to process revision review',
      });
    }
  }
}
