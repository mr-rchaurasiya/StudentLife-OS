import { Request, Response } from 'express';
import { scholarshipService } from '../services/scholarship.service';
import { ApiResponse } from '@studentlife/shared';

export class ScholarshipController {
  public async getScholarships(req: Request, res: Response): Promise<void> {
    try {
      const schemes = await scholarshipService.getScholarships();
      const response: ApiResponse<typeof schemes> = {
        success: true,
        data: schemes,
        message: 'Scholarship schemes retrieved successfully',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async toggleBookmark(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await scholarshipService.toggleBookmark(id);
      if (!updated) {
        res.status(404).json({ success: false, error: { message: 'Scheme not found' } });
        return;
      }
      const response: ApiResponse<typeof updated> = {
        success: true,
        data: updated,
        message: 'Bookmark updated',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async checkEligibility(req: Request, res: Response): Promise<void> {
    try {
      const result = await scholarshipService.checkEligibility(req.body);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Eligibility evaluation completed',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async getDocumentChecklist(req: Request, res: Response): Promise<void> {
    try {
      const checklist = await scholarshipService.getDocumentChecklist();
      const response: ApiResponse<typeof checklist> = {
        success: true,
        data: checklist,
        message: 'Document checklist retrieved',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async toggleDocumentVerification(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await scholarshipService.toggleDocumentVerification(id);
      if (!updated) {
        res.status(404).json({ success: false, error: { message: 'Document item not found' } });
        return;
      }
      const response: ApiResponse<typeof updated> = {
        success: true,
        data: updated,
        message: 'Document verification toggled',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const scholarshipController = new ScholarshipController();
