import { Request, Response } from 'express';
import { quantumLabService } from '../services/quantum-lab.service';

export class QuantumLabController {
  async simulateCircuit(req: Request, res: Response): Promise<void> {
    try {
      const { qubitCount, gates, preset } = req.body;
      const state = await quantumLabService.simulateCircuit({
        qubitCount: Number(qubitCount) || 2,
        gates: gates || [],
        preset,
      });
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const quantumLabController = new QuantumLabController();
