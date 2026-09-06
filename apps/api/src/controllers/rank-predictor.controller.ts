import { Request, Response } from 'express';
import { rankPredictorService } from '../services/rank-predictor.service';
import { ApiResponse, PredictRankDto, RetestMistakeDto } from '@studentlife/shared';

export class RankPredictorController {
  public predictRank = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: PredictRankDto = req.body;
      const result = rankPredictorService.predictRank(dto);
      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'RANK_PREDICT_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public getAllMistakes = async (_req: Request, res: Response): Promise<void> => {
    try {
      const mistakes = rankPredictorService.getAllMistakes();
      res.json({
        success: true,
        data: mistakes,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'MISTAKES_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public retestMistake = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: RetestMistakeDto = req.body;
      const result = rankPredictorService.retestMistake(dto);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'RETEST_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const rankPredictorController = new RankPredictorController();
