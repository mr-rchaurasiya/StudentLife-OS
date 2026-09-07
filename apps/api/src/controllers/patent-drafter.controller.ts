import { Request, Response } from 'express';
import { PatentDrafterService } from '../services/patent-drafter.service';

export class PatentDrafterController {
  public static async getDrafts(_req: Request, res: Response): Promise<void> {
    try {
      const drafts = PatentDrafterService.getDrafts();
      res.json({ success: true, data: drafts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async draftPatent(req: Request, res: Response): Promise<void> {
    try {
      const draft = PatentDrafterService.draftPatent(req.body);
      res.json({ success: true, data: draft });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
