import { Request, Response } from 'express';
import { resumeService } from '../services/resume.service';
import { ApiResponse } from '@studentlife/shared';

export class ResumeController {
  public async getResume(req: Request, res: Response): Promise<void> {
    try {
      const resume = await resumeService.getResume();
      const response: ApiResponse<typeof resume> = {
        success: true,
        data: resume,
        message: 'Resume retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async updateResume(req: Request, res: Response): Promise<void> {
    try {
      const updated = await resumeService.updateResume(req.body);
      const response: ApiResponse<typeof updated> = {
        success: true,
        data: updated,
        message: 'Resume updated successfully',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async analyzeAts(req: Request, res: Response): Promise<void> {
    try {
      const report = await resumeService.analyzeAts(req.body);
      const response: ApiResponse<typeof report> = {
        success: true,
        data: report,
        message: 'ATS analysis completed',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async optimizeBullet(req: Request, res: Response): Promise<void> {
    try {
      const suggestion = await resumeService.optimizeBullet(req.body);
      const response: ApiResponse<typeof suggestion> = {
        success: true,
        data: suggestion,
        message: 'Bullet point optimized into STAR framework',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async generateInterviewQa(req: Request, res: Response): Promise<void> {
    try {
      const questions = await resumeService.generateInterviewQa(req.body);
      const response: ApiResponse<typeof questions> = {
        success: true,
        data: questions,
        message: 'Tailored interview questions generated',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const resumeController = new ResumeController();
