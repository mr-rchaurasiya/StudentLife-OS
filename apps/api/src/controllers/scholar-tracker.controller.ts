import { Request, Response } from 'express';
import { scholarTrackerService } from '../services/scholar-tracker.service';
import { TrackScholarDto } from '@studentlife/shared';

export class ScholarTrackerController {
  public async getProfile(_req: Request, res: Response) {
    try {
      const profile = scholarTrackerService.getProfile();
      return res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async track(req: Request, res: Response) {
    try {
      const dto: TrackScholarDto = req.body;
      const profile = scholarTrackerService.trackScholar(dto);
      return res.status(200).json({ success: true, data: profile });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const scholarTrackerController = new ScholarTrackerController();
