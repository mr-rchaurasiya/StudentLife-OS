import { Request, Response } from 'express';
import { campusTransitService } from '../services/campus-transit.service';

export class CampusTransitController {
  async getTransitState(_req: Request, res: Response): Promise<void> {
    try {
      const state = await campusTransitService.getTransitState();
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async bookCarpoolRide(req: Request, res: Response): Promise<void> {
    try {
      const { carpoolPostId } = req.body;
      if (!carpoolPostId) {
        res.status(400).json({ success: false, message: 'carpoolPostId is required' });
        return;
      }
      const state = await campusTransitService.bookCarpoolRide({ carpoolPostId });
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const campusTransitController = new CampusTransitController();
