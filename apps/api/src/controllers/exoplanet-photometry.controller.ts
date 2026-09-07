import { Request, Response } from 'express';
import { ExoplanetPhotometryService } from '../services/exoplanet-photometry.service';

const exoService = new ExoplanetPhotometryService();

export class ExoplanetPhotometryController {
  async analyze(req: Request, res: Response): Promise<void> {
    try {
      const result = await exoService.analyzeLightCurve(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
