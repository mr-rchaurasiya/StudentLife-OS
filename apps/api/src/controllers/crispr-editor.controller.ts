import { Request, Response } from 'express';
import { CrisprEditorService } from '../services/crispr-editor.service';

const crisprService = new CrisprEditorService();

export class CrisprEditorController {
  async designGuide(req: Request, res: Response): Promise<void> {
    try {
      const result = await crisprService.designGuideRna(req.body);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
