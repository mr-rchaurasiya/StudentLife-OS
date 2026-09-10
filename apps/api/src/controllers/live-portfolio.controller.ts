import { Request, Response } from 'express';
import { livePortfolioService } from '../services/live-portfolio.service';

export class LivePortfolioController {
  public async getPortfolio(req: Request, res: Response): Promise<void> {
    try {
      const username = req.params.username || (req.query.username as string) || 'rohan-verma';
      const portfolio = livePortfolioService.getPortfolio(username);
      res.json({ success: true, data: portfolio });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public async draftOutreach(req: Request, res: Response): Promise<void> {
    try {
      const { recipientType, recipientName, companyOrUniversity, targetRoleOrLab, studentKeyAchievement } = req.body;
      const result = livePortfolioService.draftColdOutreach({
        recipientType: recipientType || 'RECRUITER',
        recipientName: recipientName || 'Hiring Manager',
        companyOrUniversity: companyOrUniversity || 'Target Org',
        targetRoleOrLab: targetRoleOrLab || 'Software Engineer',
        studentKeyAchievement: studentKeyAchievement || 'High-performance computing projects'
      });
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const livePortfolioController = new LivePortfolioController();
