import { Request, Response } from 'express';
import { CampusExchangeService } from '../services/campus-exchange.service';

export class CampusExchangeController {
  public static async getItems(_req: Request, res: Response): Promise<void> {
    try {
      const items = CampusExchangeService.getItems();
      res.json({ success: true, data: items });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async reportItem(req: Request, res: Response): Promise<void> {
    try {
      const { type, category, title, locationDetails, description, contactHandle } = req.body;
      if (!title || !locationDetails || !description) {
        res.status(400).json({ success: false, message: 'Title, location, and description are required' });
        return;
      }
      const item = CampusExchangeService.reportItem({
        type: type || 'LOST',
        category: category || 'BOOK_STATIONERY',
        title,
        locationDetails,
        description,
        contactHandle: contactHandle || '@student'
      });
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async claimItem(req: Request, res: Response): Promise<void> {
    try {
      const item = CampusExchangeService.claimItem(req.params.id);
      if (!item) {
        res.status(404).json({ success: false, message: 'Item not found' });
        return;
      }
      res.json({ success: true, data: item });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
