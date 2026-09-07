import { Request, Response } from 'express';
import { CenturyGrandmasterService } from '../services/century-grandmaster.service';

export class CenturyGrandmasterController {
  private service: CenturyGrandmasterService;

  constructor() {
    this.service = new CenturyGrandmasterService();
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const profile = await this.service.getProfile();
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get century grandmaster profile' });
    }
  }

  async claimMedallion(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.claimMedallion(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to claim century medallion' });
    }
  }
}
