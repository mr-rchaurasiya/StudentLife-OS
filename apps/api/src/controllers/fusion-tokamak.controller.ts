import { Request, Response } from 'express';
import { FusionTokamakService } from '../services/fusion-tokamak.service';

const fusionService = new FusionTokamakService();

export class FusionTokamakController {
  async simulate(req: Request, res: Response): Promise<void> {
    try {
      const result = await fusionService.simulateTokamak(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
