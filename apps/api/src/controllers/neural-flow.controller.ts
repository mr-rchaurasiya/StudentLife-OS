import { Request, Response } from 'express';
import { NeuralFlowService } from '../services/neural-flow.service';

export class NeuralFlowController {
  public static async getTelemetry(_req: Request, res: Response): Promise<void> {
    try {
      const telemetry = NeuralFlowService.getTelemetry();
      res.json({ success: true, data: telemetry });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async adjustFrequency(req: Request, res: Response): Promise<void> {
    try {
      const updated = NeuralFlowService.adjustFrequency(req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
