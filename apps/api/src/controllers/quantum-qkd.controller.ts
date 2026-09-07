import { Request, Response } from 'express';
import { QuantumQkdService } from '../services/quantum-qkd.service';

const qkdService = new QuantumQkdService();

export class QuantumQkdController {
  async simulateProtocol(req: Request, res: Response): Promise<void> {
    try {
      const result = await qkdService.simulateQkd(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
