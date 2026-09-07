import { Request, Response } from 'express';
import { mentalResilienceService } from '../services/mental-resilience.service';

export class MentalResilienceController {
  async getSanctumState(_req: Request, res: Response): Promise<void> {
    try {
      const state = await mentalResilienceService.getSanctumState();
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async checkInResilience(req: Request, res: Response): Promise<void> {
    try {
      const { currentStressScore, triggerSource, rawWorryText } = req.body;
      if (currentStressScore === undefined || !rawWorryText) {
        res.status(400).json({ success: false, message: 'currentStressScore and rawWorryText are required' });
        return;
      }
      const state = await mentalResilienceService.checkInResilience({
        currentStressScore: Number(currentStressScore),
        triggerSource: triggerSource || 'Upcoming Exams & Coursework',
        rawWorryText,
      });
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async setBreathingMode(req: Request, res: Response): Promise<void> {
    try {
      const { mode } = req.body;
      if (!mode) {
        res.status(400).json({ success: false, message: 'mode is required' });
        return;
      }
      const state = await mentalResilienceService.setBreathingMode(mode);
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const mentalResilienceController = new MentalResilienceController();
