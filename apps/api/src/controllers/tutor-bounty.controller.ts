import { Request, Response } from 'express';
import { TutorBountyService } from '../services/tutor-bounty.service';

export class TutorBountyController {
  public static async getBounties(_req: Request, res: Response): Promise<void> {
    try {
      const bounties = TutorBountyService.getBounties();
      res.json({ success: true, data: bounties });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async createBounty(req: Request, res: Response): Promise<void> {
    try {
      const bounty = TutorBountyService.createBounty(req.body);
      res.json({ success: true, data: bounty });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async acceptBounty(req: Request, res: Response): Promise<void> {
    try {
      const bounty = TutorBountyService.acceptBounty(req.body);
      res.json({ success: true, data: bounty });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
