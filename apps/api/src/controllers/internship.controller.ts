import { Request, Response } from 'express';
import { internshipService } from '../services/internship.service';
import { ApiResponse } from '@studentlife/shared';

export class InternshipController {
  public async getOpportunities(req: Request, res: Response): Promise<void> {
    try {
      const opportunities = await internshipService.getOpportunities();
      const response: ApiResponse<typeof opportunities> = {
        success: true,
        data: opportunities,
        message: 'Internship opportunities retrieved successfully',
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
      const updated = await internshipService.toggleBookmark(id);
      if (!updated) {
        res.status(404).json({ success: false, error: { message: 'Opportunity not found' } });
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

  public async getTrackedApplications(req: Request, res: Response): Promise<void> {
    try {
      const applications = await internshipService.getTrackedApplications();
      const response: ApiResponse<typeof applications> = {
        success: true,
        data: applications,
        message: 'Tracked applications retrieved',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async createTrackedApplication(req: Request, res: Response): Promise<void> {
    try {
      const created = await internshipService.createTrackedApplication(req.body);
      const response: ApiResponse<typeof created> = {
        success: true,
        data: created,
        message: 'Application added to Kanban pipeline',
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async updateApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await internshipService.updateApplication(id, req.body);
      if (!updated) {
        res.status(404).json({ success: false, error: { message: 'Application not found' } });
        return;
      }
      const response: ApiResponse<typeof updated> = {
        success: true,
        data: updated,
        message: 'Application updated',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async deleteApplication(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await internshipService.deleteApplication(id);
      const response: ApiResponse<{ id: string }> = {
        success: true,
        data: { id },
        message: 'Application removed from Kanban pipeline',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }

  public async generateColdOutreach(req: Request, res: Response): Promise<void> {
    try {
      const template = await internshipService.generateColdOutreach(req.body);
      const response: ApiResponse<typeof template> = {
        success: true,
        data: template,
        message: 'Cold outreach templates generated',
        timestamp: new Date().toISOString(),
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, error: { message: error.message } });
    }
  }
}

export const internshipController = new InternshipController();
