import { Request, Response } from 'express';
import { FacultyAdvisoryService } from '../services/faculty-advisory.service';

export class FacultyAdvisoryController {
  public static async getSlots(_req: Request, res: Response): Promise<void> {
    try {
      const slots = FacultyAdvisoryService.getFacultySlots();
      res.json({ success: true, data: slots });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async getBookings(_req: Request, res: Response): Promise<void> {
    try {
      const bookings = FacultyAdvisoryService.getBookings();
      res.json({ success: true, data: bookings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  public static async bookSlot(req: Request, res: Response): Promise<void> {
    try {
      const booking = FacultyAdvisoryService.bookSlot(req.body);
      res.json({ success: true, data: booking });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
