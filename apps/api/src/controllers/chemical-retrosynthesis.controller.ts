import { Request, Response } from 'express';
import { chemicalRetrosynthesisService } from '../services/chemical-retrosynthesis.service';
import { PlanRetrosynthesisDto } from '@studentlife/shared';

export class ChemicalRetrosynthesisController {
  public async getPathway(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const result = chemicalRetrosynthesisService.getPathway(id);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async plan(req: Request, res: Response) {
    try {
      const dto: PlanRetrosynthesisDto = req.body;
      const result = chemicalRetrosynthesisService.planRetrosynthesis(dto);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const chemicalRetrosynthesisController = new ChemicalRetrosynthesisController();
