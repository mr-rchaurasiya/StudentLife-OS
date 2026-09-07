import { Request, Response } from 'express';
import { HackathonRadarService } from '../services/hackathon-radar.service';

export class HackathonRadarController {
  public static async getEvents(_req: Request, res: Response): Promise<void> {
    try {
      const events = HackathonRadarService.getEvents();
      res.json({ success: true, data: events });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async findTeammates(req: Request, res: Response): Promise<void> {
    try {
      const matches = HackathonRadarService.findTeammates(req.body);
      res.json({ success: true, data: matches });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
