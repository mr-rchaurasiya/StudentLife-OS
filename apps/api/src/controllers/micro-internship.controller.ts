import { Request, Response } from 'express';
import { microInternshipService } from '../services/micro-internship.service';
import { SubmitProofOfWorkDto } from '@studentlife/shared';

export class MicroInternshipController {
  public async getGigs(_req: Request, res: Response) {
    try {
      const gigs = microInternshipService.getAllGigs();
      return res.status(200).json({ success: true, data: gigs });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async submitProof(req: Request, res: Response) {
    try {
      const dto: SubmitProofOfWorkDto = req.body;
      const gig = microInternshipService.submitProofOfWork(dto);
      if (!gig) {
        return res.status(404).json({ success: false, message: 'Gig not found' });
      }
      return res.status(200).json({ success: true, data: gig });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async releaseEscrow(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const gig = microInternshipService.releaseEscrow(id);
      if (!gig) {
        return res.status(404).json({ success: false, message: 'Gig not found' });
      }
      return res.status(200).json({ success: true, data: gig });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const microInternshipController = new MicroInternshipController();
