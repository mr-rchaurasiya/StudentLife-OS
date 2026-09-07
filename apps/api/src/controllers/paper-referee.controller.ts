import { Request, Response } from 'express';
import { PaperRefereeService } from '../services/paper-referee.service';

const refereeService = new PaperRefereeService();

export class PaperRefereeController {
  async reviewSubmission(req: Request, res: Response): Promise<void> {
    try {
      const result = await refereeService.reviewPaper(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
