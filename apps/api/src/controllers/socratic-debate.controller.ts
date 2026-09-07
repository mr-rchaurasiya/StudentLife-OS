import { Request, Response } from 'express';
import { SocraticDebateService } from '../services/socratic-debate.service';

export class SocraticDebateController {
  public static async startDebate(req: Request, res: Response): Promise<void> {
    try {
      const { topicMotion, persona } = req.body;
      if (!topicMotion) {
        res.status(400).json({ success: false, message: 'Topic motion is required' });
        return;
      }
      const session = SocraticDebateService.startDebate({
        topicMotion,
        persona: persona || 'STRICT_EXAMINER'
      });
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async submitArgument(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, userArgument } = req.body;
      if (!sessionId || !userArgument) {
        res.status(400).json({ success: false, message: 'Session ID and argument are required' });
        return;
      }
      const updated = SocraticDebateService.submitArgument({ sessionId, userArgument });
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getSession(req: Request, res: Response): Promise<void> {
    try {
      const session = SocraticDebateService.getSession(req.params.sessionId);
      if (!session) {
        res.status(404).json({ success: false, message: 'Session not found' });
        return;
      }
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
