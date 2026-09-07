import { Request, Response } from 'express';
import { HostelNutritionService } from '../services/hostel-nutrition.service';

export class HostelNutritionController {
  public static async getMenu(_req: Request, res: Response): Promise<void> {
    try {
      const menu = HostelNutritionService.getMenu();
      res.json({ success: true, data: menu });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getLog(_req: Request, res: Response): Promise<void> {
    try {
      const log = HostelNutritionService.getLog();
      res.json({ success: true, data: log });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async logIntake(req: Request, res: Response): Promise<void> {
    try {
      const updated = HostelNutritionService.logIntake(req.body);
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async rateMeal(req: Request, res: Response): Promise<void> {
    try {
      const result = HostelNutritionService.rateMeal(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
