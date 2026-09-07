import { Request, Response } from 'express';
import { ResearchLabService } from '../services/research-lab.service';

export class ResearchLabController {
  public static async getProposals(_req: Request, res: Response): Promise<void> {
    try {
      const proposals = ResearchLabService.getProposals();
      res.json({ success: true, data: proposals });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async runAgents(req: Request, res: Response): Promise<void> {
    try {
      const proposal = ResearchLabService.runAgents(req.body);
      res.json({ success: true, data: proposal });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
