import { Request, Response } from 'express';
import { VentureSyndicateService } from '../services/venture-syndicate.service';

const syndicateService = new VentureSyndicateService();

export class VentureSyndicateController {
  async generateSafe(req: Request, res: Response): Promise<void> {
    try {
      const result = await syndicateService.generateSafeNote(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
