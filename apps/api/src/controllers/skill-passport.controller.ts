import { Request, Response } from 'express';
import { SkillPassportService } from '../services/skill-passport.service';

export class SkillPassportController {
  public static async getPassportSummary(_req: Request, res: Response): Promise<void> {
    try {
      const summary = SkillPassportService.getPassportSummary();
      res.json({ success: true, data: summary });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async generateCredential(req: Request, res: Response): Promise<void> {
    try {
      const { credentialTitle, skills } = req.body;
      if (!credentialTitle) {
        res.status(400).json({ success: false, message: 'Credential title is required' });
        return;
      }
      const cred = SkillPassportService.generateCredential({ credentialTitle, skills: skills || [] });
      res.json({ success: true, data: cred });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
