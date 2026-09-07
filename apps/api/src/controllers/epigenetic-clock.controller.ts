import { Request, Response } from 'express';
import { EpigeneticClockService } from '../services/epigenetic-clock.service';

export class EpigeneticClockController {
  private service: EpigeneticClockService;

  constructor() {
    this.service = new EpigeneticClockService();
  }

  async analyze(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.analyzeEpigenetics(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to analyze epigenetic clock' });
    }
  }
}
