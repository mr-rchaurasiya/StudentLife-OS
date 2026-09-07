import { Request, Response } from 'express';
import { circadianFocusService } from '../services/circadian-focus.service';
import { ApiResponse, UpdateHabitDto } from '@studentlife/shared';

export class CircadianFocusController {
  public getProfile = async (_req: Request, res: Response): Promise<void> => {
    try {
      const profile = circadianFocusService.getProfile();
      const response: ApiResponse = {
        success: true,
        data: profile,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PROFILE_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public updateHabit = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: UpdateHabitDto = req.body;
      const updated = circadianFocusService.updateHabit(dto);
      res.json({
        success: true,
        data: updated,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'HABIT_UPDATE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const circadianFocusController = new CircadianFocusController();
