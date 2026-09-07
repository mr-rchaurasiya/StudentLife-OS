import { Request, Response } from 'express';
import { astrodynamicsSimService } from '../services/astrodynamics-sim.service';
import { PropagateOrbitDto } from '@studentlife/shared';

export class AstrodynamicsSimController {
  public async getOrbitState(_req: Request, res: Response) {
    try {
      const state = astrodynamicsSimService.getOrbitState();
      return res.status(200).json({ success: true, data: state });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async propagate(req: Request, res: Response) {
    try {
      const dto: PropagateOrbitDto = req.body;
      const result = astrodynamicsSimService.propagateOrbit(dto);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const astrodynamicsSimController = new AstrodynamicsSimController();
