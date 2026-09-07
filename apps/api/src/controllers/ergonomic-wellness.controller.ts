import { Request, Response } from 'express';
import { ErgonomicWellnessService } from '../services/ergonomic-wellness.service';

export class ErgonomicWellnessController {
  public static async getProfile(_req: Request, res: Response): Promise<void> {
    try {
      const profile = ErgonomicWellnessService.getProfile();
      res.json({ success: true, data: profile });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async logSession(req: Request, res: Response): Promise<void> {
    try {
      const updated = ErgonomicWellnessService.logSession(req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async recordAction(req: Request, res: Response): Promise<void> {
    try {
      const { action } = req.body;
      const updated = ErgonomicWellnessService.recordAction(action || 'EYE_BREAK');
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
