import { Request, Response } from 'express';
import { campusIncubatorService } from '../services/campus-incubator.service';

export class CampusIncubatorController {
  async getProjects(_req: Request, res: Response): Promise<void> {
    try {
      const projects = await campusIncubatorService.getProjects();
      res.json({ success: true, data: projects });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async generatePitchDeck(req: Request, res: Response): Promise<void> {
    try {
      const { startupName, industryVertical, rawProjectIdea, targetMarket } = req.body;
      if (!startupName || !rawProjectIdea) {
        res.status(400).json({ success: false, message: 'startupName and rawProjectIdea are required' });
        return;
      }
      const project = await campusIncubatorService.generatePitchDeck({
        startupName,
        industryVertical: industryVertical || 'EdTech & AI',
        rawProjectIdea,
        targetMarket,
      });
      res.json({ success: true, data: project });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const campusIncubatorController = new CampusIncubatorController();
