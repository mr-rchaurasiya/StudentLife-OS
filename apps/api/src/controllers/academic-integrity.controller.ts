import { Request, Response } from 'express';
import { academicIntegrityService } from '../services/academic-integrity.service';

export class AcademicIntegrityController {
  async getReports(_req: Request, res: Response): Promise<void> {
    try {
      const reports = await academicIntegrityService.getReports();
      res.json({ success: true, data: reports });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async auditManuscript(req: Request, res: Response): Promise<void> {
    try {
      const { documentTitle, manuscriptText } = req.body;
      if (!documentTitle || !manuscriptText) {
        res.status(400).json({ success: false, message: 'documentTitle and manuscriptText are required' });
        return;
      }
      const report = await academicIntegrityService.auditManuscript({
        documentTitle,
        manuscriptText,
      });
      res.json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const academicIntegrityController = new AcademicIntegrityController();
