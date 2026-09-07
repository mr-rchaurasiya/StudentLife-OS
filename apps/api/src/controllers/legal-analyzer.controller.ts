import { Request, Response } from 'express';
import { LegalAnalyzerService } from '../services/legal-analyzer.service';

const legalService = new LegalAnalyzerService();

export class LegalAnalyzerController {
  async analyze(req: Request, res: Response): Promise<void> {
    try {
      const result = await legalService.analyzeContract(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
