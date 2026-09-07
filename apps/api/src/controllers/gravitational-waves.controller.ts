import { Request, Response } from 'express';
import { GravitationalWavesService } from '../services/gravitational-waves.service';

export class GravitationalWavesController {
  private service: GravitationalWavesService;

  constructor() {
    this.service = new GravitationalWavesService();
  }

  async simulate(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.simulateMerger(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to simulate gravitational wave merger' });
    }
  }
}
