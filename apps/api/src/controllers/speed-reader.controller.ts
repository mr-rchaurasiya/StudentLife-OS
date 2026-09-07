import { Request, Response } from 'express';
import { speedReaderService } from '../services/speed-reader.service';

export class SpeedReaderController {
  async getSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = (req.query.sessionId as string) || 'session-default-01';
      const session = await speedReaderService.getSession(sessionId);
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async startSession(req: Request, res: Response): Promise<void> {
    try {
      const { documentTitle, rawArticleText, targetWpm } = req.body;
      if (!documentTitle || !rawArticleText) {
        res.status(400).json({ success: false, message: 'documentTitle and rawArticleText are required' });
        return;
      }
      const session = await speedReaderService.startSession({
        documentTitle,
        rawArticleText,
        targetWpm: Number(targetWpm) || 450,
      });
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const speedReaderController = new SpeedReaderController();
