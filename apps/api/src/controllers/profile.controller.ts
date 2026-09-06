import { Response, NextFunction } from 'express';
import { ProfileService } from '../services/profile.service';
import { ApiResponse, StudentProfile } from '@studentlife/shared';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class ProfileController {
  static async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const profile = await ProfileService.getProfileByUserId(userId);

      const response: ApiResponse<StudentProfile> = {
        success: true,
        message: 'Student profile retrieved successfully',
        data: profile,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const updated = await ProfileService.updateProfile(userId, req.body);

      const response: ApiResponse<StudentProfile> = {
        success: true,
        message: 'Student profile & goals updated successfully!',
        data: updated,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async claimStreak(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const result = await ProfileService.claimDailyStreak(userId);

      const response: ApiResponse<{ profile: StudentProfile; streakBonus: number; alreadyClaimed: boolean }> = {
        success: true,
        message: result.alreadyClaimed ? 'Daily streak already logged for today!' : `Streak updated! +${result.streakBonus} XP earned 🔥`,
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
