import { Request, Response } from 'express';
import { GamificationService } from '../services/gamification.service';
import { ApiResponse, LeaderboardFilterScope } from '@studentlife/shared';

export class GamificationController {
  public static getDashboardData(req: Request, res: Response): void {
    const scope = (req.query.scope as LeaderboardFilterScope) || 'ALL_INDIA';
    const data = GamificationService.getGamificationData(scope);
    const response: ApiResponse<typeof data> = {
      success: true,
      data,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }

  public static claimBadge(req: Request, res: Response): void {
    const { badgeId } = req.params;
    const badge = GamificationService.claimBadgeBonus(badgeId);
    if (!badge) {
      res.status(404).json({
        success: false,
        error: 'Badge not found or locked',
        timestamp: new Date().toISOString()
      });
      return;
    }

    const response: ApiResponse<typeof badge> = {
      success: true,
      data: badge,
      message: `🎉 +${badge.xpBonus} XP Claimed for ${badge.title}!`,
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }
}
