import { Request, Response } from 'express';
import { campusDigitalTwinService } from '../services/campus-digital-twin.service';

export class CampusDigitalTwinController {
  async getDigitalTwinState(_req: Request, res: Response): Promise<void> {
    try {
      const state = await campusDigitalTwinService.getDigitalTwinState();
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async findCampusRoute(req: Request, res: Response): Promise<void> {
    try {
      const { fromBuildingId, toBuildingId } = req.body;
      if (!fromBuildingId || !toBuildingId) {
        res.status(400).json({ success: false, message: 'fromBuildingId and toBuildingId are required' });
        return;
      }
      const state = await campusDigitalTwinService.findCampusRoute({
        fromBuildingId,
        toBuildingId,
      });
      res.json({ success: true, data: state });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const campusDigitalTwinController = new CampusDigitalTwinController();
