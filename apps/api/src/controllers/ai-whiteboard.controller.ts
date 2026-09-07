import { Request, Response } from 'express';
import { AiWhiteboardService } from '../services/ai-whiteboard.service';

export class AiWhiteboardController {
  public static async getDiagrams(_req: Request, res: Response): Promise<void> {
    try {
      const diagrams = AiWhiteboardService.getDiagrams();
      res.json({ success: true, data: diagrams });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async generateAiDiagram(req: Request, res: Response): Promise<void> {
    try {
      const { topic, diagramType } = req.body;
      if (!topic) {
        res.status(400).json({ success: false, message: 'Topic is required' });
        return;
      }
      const generated = AiWhiteboardService.generateAiDiagram({ topic, diagramType: diagramType || 'FLOWCHART' });
      res.json({ success: true, data: generated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async saveDiagram(req: Request, res: Response): Promise<void> {
    try {
      const saved = AiWhiteboardService.saveDiagram(req.body);
      res.json({ success: true, data: saved });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
