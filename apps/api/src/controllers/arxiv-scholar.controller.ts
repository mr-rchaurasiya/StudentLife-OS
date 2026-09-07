import { Request, Response } from 'express';
import { ArxivScholarService } from '../services/arxiv-scholar.service';

export class ArxivScholarController {
  public static async getPapers(_req: Request, res: Response): Promise<void> {
    try {
      const papers = ArxivScholarService.getPapers();
      res.json({ success: true, data: papers });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async searchAndSummarize(req: Request, res: Response): Promise<void> {
    try {
      const { query, domain } = req.body;
      if (!query) {
        res.status(400).json({ success: false, message: 'Search query is required' });
        return;
      }
      const paper = ArxivScholarService.searchAndSummarize({ query, domain });
      res.json({ success: true, data: paper });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
