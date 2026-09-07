import { Request, Response } from 'express';
import { polyglotTranslatorService } from '../services/polyglot-translator.service';
import { TranslatePaperDto } from '@studentlife/shared';

export class PolyglotTranslatorController {
  public async translate(req: Request, res: Response) {
    try {
      const dto: TranslatePaperDto = req.body;
      const session = await polyglotTranslatorService.translatePaper(dto);
      return res.status(200).json({ success: true, data: session });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async getSession(req: Request, res: Response) {
    try {
      const session = polyglotTranslatorService.getSession(req.params.id);
      return res.status(200).json({ success: true, data: session });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const polyglotTranslatorController = new PolyglotTranslatorController();
