import { Request, Response } from 'express';
import { mindmapStudioService } from '../services/mindmap-studio.service';

export class MindmapStudioController {
  public async getMindmap(req: Request, res: Response): Promise<void> {
    try {
      const id = (req.query.id as string) || 'mm-quantum-computing';
      const map = mindmapStudioService.getMindmap(id);
      res.json({ success: true, data: map });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async generateMindmap(req: Request, res: Response): Promise<void> {
    try {
      const { topicTitle, domain, sourceTextOrNotes } = req.body;
      const map = mindmapStudioService.generateMindmap({
        topicTitle: topicTitle || 'Advanced Topic',
        domain: domain || 'General Science',
        sourceTextOrNotes
      });
      res.json({ success: true, data: map });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async revealNode(req: Request, res: Response): Promise<void> {
    try {
      const { mapId, nodeId } = req.body;
      const map = mindmapStudioService.revealNode(mapId || 'mm-quantum-computing', nodeId);
      res.json({ success: true, data: map });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const mindmapStudioController = new MindmapStudioController();
