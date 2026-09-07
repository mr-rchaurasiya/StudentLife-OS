import { Request, Response } from 'express';
import { BciSpellerService } from '../services/bci-speller.service';

const bciService = new BciSpellerService();

export class BciSpellerController {
  async processEpoch(req: Request, res: Response): Promise<void> {
    try {
      const result = await bciService.processEpoch(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
