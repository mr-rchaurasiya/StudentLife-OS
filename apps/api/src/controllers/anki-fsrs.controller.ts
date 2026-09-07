import { Request, Response } from 'express';
import { ankiFsrsService } from '../services/anki-fsrs.service';
import { ReviewFsrsCardDto, GenerateClozeCardsDto } from '@studentlife/shared';

export class AnkiFsrsController {
  public async getDeckState(_req: Request, res: Response) {
    try {
      const state = ankiFsrsService.getDeckState();
      return res.status(200).json({ success: true, data: state });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async reviewCard(req: Request, res: Response) {
    try {
      const dto: ReviewFsrsCardDto = req.body;
      const card = ankiFsrsService.reviewCard(dto);
      if (!card) {
        return res.status(404).json({ success: false, message: 'Card not found' });
      }
      return res.status(200).json({ success: true, data: card });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async generateCloze(req: Request, res: Response) {
    try {
      const dto: GenerateClozeCardsDto = req.body;
      const state = ankiFsrsService.generateCloze(dto);
      return res.status(200).json({ success: true, data: state });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const ankiFsrsController = new AnkiFsrsController();
