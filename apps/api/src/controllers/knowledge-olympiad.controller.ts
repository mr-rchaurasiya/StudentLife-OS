import { Request, Response } from 'express';
import { knowledgeOlympiadService } from '../services/knowledge-olympiad.service';
import { SubmitOlympiadAnswerDto } from '@studentlife/shared';

export class KnowledgeOlympiadController {
  public async getMatchState(req: Request, res: Response) {
    try {
      const matchId = req.query.matchId as string;
      const state = knowledgeOlympiadService.getMatchState(matchId);
      return res.status(200).json({ success: true, data: state });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  public async submitAnswer(req: Request, res: Response) {
    try {
      const dto: SubmitOlympiadAnswerDto = req.body;
      const match = knowledgeOlympiadService.submitAnswer(dto);
      return res.status(200).json({ success: true, data: match });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export const knowledgeOlympiadController = new KnowledgeOlympiadController();
