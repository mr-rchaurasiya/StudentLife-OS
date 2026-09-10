import { Request, Response } from 'express';
import { videoMockInterviewService } from '../services/video-mock-interview.service';

export class VideoMockInterviewController {
  public async startSession(req: Request, res: Response): Promise<void> {
    try {
      const { candidateName, track, targetRole } = req.body;
      const session = videoMockInterviewService.startSession({
        candidateName: candidateName || 'Candidate',
        track: track || 'SOFTWARE_ENGINEERING_DSA',
        targetRole
      });
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async evaluateAnswer(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, questionId, candidateAnswerTranscript, audioWpm, fillerWordsObserved } = req.body;
      if (!sessionId) {
        res.status(400).json({ success: false, message: 'sessionId is required' });
        return;
      }
      const updated = videoMockInterviewService.evaluateAnswer({
        sessionId,
        questionId: questionId || 'q-1',
        candidateAnswerTranscript: candidateAnswerTranscript || 'Answer provided via speech/video',
        audioWpm: audioWpm || 135,
        fillerWordsObserved: fillerWordsObserved || 0
      });
      res.json({ success: true, data: updated });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = req.params.sessionId || (req.query.sessionId as string);
      const session = videoMockInterviewService.getSession(sessionId);
      if (!session) {
        res.status(404).json({ success: false, message: 'Interview session not found' });
        return;
      }
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const videoMockInterviewController = new VideoMockInterviewController();
