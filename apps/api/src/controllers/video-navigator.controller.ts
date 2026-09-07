import { Request, Response } from 'express';
import { VideoNavigatorService } from '../services/video-navigator.service';

export class VideoNavigatorController {
  public static async getLectures(_req: Request, res: Response): Promise<void> {
    try {
      const lectures = VideoNavigatorService.getLectures();
      res.json({ success: true, data: lectures });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async analyzeLecture(req: Request, res: Response): Promise<void> {
    try {
      const { videoUrl, targetSubject } = req.body;
      if (!videoUrl) {
        res.status(400).json({ success: false, message: 'Video URL is required' });
        return;
      }
      const analysis = VideoNavigatorService.analyzeLecture({ videoUrl, targetSubject });
      res.json({ success: true, data: analysis });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
