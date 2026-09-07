import { Request, Response } from 'express';
import { aiStudySwarmService } from '../services/ai-study-swarm.service';

export class AiStudySwarmController {
  async getSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = (req.query.sessionId as string) || 'swarm-default-01';
      const session = await aiStudySwarmService.getSession(sessionId);
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async startSession(req: Request, res: Response): Promise<void> {
    try {
      const { subjectTopic, activePersonaIds } = req.body;
      if (!subjectTopic) {
        res.status(400).json({ success: false, message: 'subjectTopic is required' });
        return;
      }
      const session = await aiStudySwarmService.startSession({ subjectTopic, activePersonaIds });
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async postQuery(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, questionOrDoubt } = req.body;
      if (!sessionId || !questionOrDoubt) {
        res.status(400).json({ success: false, message: 'sessionId and questionOrDoubt are required' });
        return;
      }
      const session = await aiStudySwarmService.postQuery({ sessionId, questionOrDoubt });
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async submitVivaAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, studentAnswer } = req.body;
      if (!sessionId || !studentAnswer) {
        res.status(400).json({ success: false, message: 'sessionId and studentAnswer are required' });
        return;
      }
      const session = await aiStudySwarmService.submitVivaAnswer({ sessionId, studentAnswer });
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const aiStudySwarmController = new AiStudySwarmController();
