import { Request, Response } from 'express';
import { notesMarketplaceService } from '../services/notes-marketplace.service';
import { ApiResponse, UploadResourceDto, UnlockResourceDto } from '@studentlife/shared';

export class NotesMarketplaceController {
  public getAllResources = async (_req: Request, res: Response): Promise<void> => {
    try {
      const resources = notesMarketplaceService.getAllResources();
      const response: ApiResponse = {
        success: true,
        data: resources,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'RESOURCES_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public unlockResource = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: UnlockResourceDto = req.body;
      const resource = notesMarketplaceService.unlockResource(dto);
      res.json({
        success: true,
        data: resource,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'UNLOCK_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public uploadResource = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: UploadResourceDto = req.body;
      const resource = notesMarketplaceService.uploadResource(dto);
      res.status(201).json({
        success: true,
        data: resource,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'UPLOAD_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const notesMarketplaceController = new NotesMarketplaceController();
