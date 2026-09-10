import { Request, Response } from 'express';
import { voiceTutorService } from '../services/voice-tutor.service';

export class VoiceTutorController {
  public async getSession(req: Request, res: Response): Promise<void> {
    try {
      const sessionId = (req.query.sessionId as string) || 'sess-voice-demo';
      const session = voiceTutorService.getSession(sessionId);
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async askVoice(req: Request, res: Response): Promise<void> {
    try {
      const { sessionId, studentSpokenText, language, subjectDomain } = req.body;
      if (!studentSpokenText) {
        res.status(400).json({ success: false, message: 'studentSpokenText is required' });
        return;
      }
      const session = voiceTutorService.askVoiceTutor({
        sessionId: sessionId || 'sess-voice-demo',
        studentSpokenText,
        language: language || 'HINGLISH',
        subjectDomain: subjectDomain || 'Physics & Mathematics'
      });
      res.json({ success: true, data: session });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const voiceTutorController = new VoiceTutorController();
