import { Request, Response } from 'express';
import { LatexStudioService } from '../services/latex-studio.service';

export class LatexStudioController {
  public static async getProject(_req: Request, res: Response): Promise<void> {
    try {
      const proj = LatexStudioService.getProject();
      res.json({ success: true, data: proj });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async compileLatex(req: Request, res: Response): Promise<void> {
    try {
      const compiled = LatexStudioService.compileLatex(req.body);
      res.json({ success: true, data: compiled });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async formatEquation(req: Request, res: Response): Promise<void> {
    try {
      const eq = LatexStudioService.formatEquation(req.body);
      res.json({ success: true, data: eq });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
