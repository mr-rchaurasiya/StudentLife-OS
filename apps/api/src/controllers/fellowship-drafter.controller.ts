import { Request, Response } from 'express';
import { fellowshipDrafterService } from '../services/fellowship-drafter.service';

export class FellowshipDrafterController {
  async getProposals(_req: Request, res: Response): Promise<void> {
    try {
      const proposals = await fellowshipDrafterService.getProposals();
      res.json({ success: true, data: proposals });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async draftProposal(req: Request, res: Response): Promise<void> {
    try {
      const { fellowshipType, applicantField, primaryResearchTopic, pastAchievementsSummary } = req.body;
      if (!fellowshipType || !applicantField || !primaryResearchTopic) {
        res.status(400).json({ success: false, message: 'fellowshipType, applicantField, and primaryResearchTopic are required' });
        return;
      }
      const proposal = await fellowshipDrafterService.draftProposal({
        fellowshipType,
        applicantField,
        primaryResearchTopic,
        pastAchievementsSummary,
      });
      res.json({ success: true, data: proposal });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const fellowshipDrafterController = new FellowshipDrafterController();
