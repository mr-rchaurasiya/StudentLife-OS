import { Request, Response } from 'express';
import { CarbonMarketService } from '../services/carbon-market.service';

const carbonService = new CarbonMarketService();

export class CarbonMarketController {
  async getReport(_req: Request, res: Response): Promise<void> {
    try {
      const result = await carbonService.getReport();
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async calculate(req: Request, res: Response): Promise<void> {
    try {
      const result = await carbonService.calculateFootprint(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async trade(req: Request, res: Response): Promise<void> {
    try {
      const result = await carbonService.tradeCredit(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
