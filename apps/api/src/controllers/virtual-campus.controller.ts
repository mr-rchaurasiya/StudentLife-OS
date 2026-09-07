import { Request, Response } from 'express';
import { virtualCampusService } from '../services/virtual-campus.service';
import { ApiResponse, MoveAvatarDto } from '@studentlife/shared';

export class VirtualCampusController {
  public getCampusState = async (_req: Request, res: Response): Promise<void> => {
    try {
      const state = virtualCampusService.getCampusState();
      const response: ApiResponse = {
        success: true,
        data: state,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'CAMPUS_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public moveAvatar = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: MoveAvatarDto = req.body;
      const state = virtualCampusService.moveAvatar(dto);
      res.json({
        success: true,
        data: state,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'MOVE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const virtualCampusController = new VirtualCampusController();
