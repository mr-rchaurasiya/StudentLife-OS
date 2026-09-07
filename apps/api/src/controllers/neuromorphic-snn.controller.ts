import { Request, Response } from 'express';
import { NeuromorphicSnnService } from '../services/neuromorphic-snn.service';

const snnService = new NeuromorphicSnnService();

export class NeuromorphicSnnController {
  async getSimulation(_req: Request, res: Response): Promise<void> {
    try {
      const result = await snnService.getLatestSimulation();
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async runSimulation(req: Request, res: Response): Promise<void> {
    try {
      const result = await snnService.runSimulation(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
