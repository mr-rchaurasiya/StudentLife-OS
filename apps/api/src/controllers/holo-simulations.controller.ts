import { Request, Response } from 'express';
import { HoloSimulationsService } from '../services/holo-simulations.service';

export class HoloSimulationsController {
  public static async getSimulations(_req: Request, res: Response): Promise<void> {
    try {
      const simulations = HoloSimulationsService.getSimulations();
      res.json({ success: true, data: simulations });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async runSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { simulationId, parameters } = req.body;
      const updated = HoloSimulationsService.runSimulation({
        simulationId: simulationId || 'sim-cpu-pipeline',
        parameters: parameters || {}
      });
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
