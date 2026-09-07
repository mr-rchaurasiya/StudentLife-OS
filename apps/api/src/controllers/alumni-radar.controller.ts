import { Request, Response } from 'express';
import { AlumniRadarService } from '../services/alumni-radar.service';

export class AlumniRadarController {
  public static async getMentors(_req: Request, res: Response): Promise<void> {
    try {
      const mentors = AlumniRadarService.getMentors();
      res.json({ success: true, data: mentors });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getRequests(_req: Request, res: Response): Promise<void> {
    try {
      const requests = AlumniRadarService.getRequests();
      res.json({ success: true, data: requests });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async requestChat(req: Request, res: Response): Promise<void> {
    try {
      const request = AlumniRadarService.requestChat(req.body);
      res.json({ success: true, data: request });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
