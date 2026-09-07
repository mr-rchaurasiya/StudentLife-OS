import { Request, Response } from 'express';
import { CampusPrintingService } from '../services/campus-printing.service';

export class CampusPrintingController {
  public static async getJobs(_req: Request, res: Response): Promise<void> {
    try {
      const jobs = CampusPrintingService.getJobs();
      res.json({ success: true, data: jobs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async createJob(req: Request, res: Response): Promise<void> {
    try {
      const job = CampusPrintingService.createJob(req.body);
      res.json({ success: true, data: job });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
