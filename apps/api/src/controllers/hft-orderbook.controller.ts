import { Request, Response } from 'express';
import { HftOrderBookService } from '../services/hft-orderbook.service';

export class HftOrderBookController {
  private service: HftOrderBookService;

  constructor() {
    this.service = new HftOrderBookService();
  }

  getSnapshot(req: Request, res: Response): void {
    const snapshot = this.service.getSnapshot();
    res.json(snapshot);
  }

  async executeTrade(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.executeTrade(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to execute trade' });
    }
  }
}
