import { Request, Response } from 'express';
import { quizBattleService } from '../services/quiz-battle.service';

export class QuizBattleController {
  public findMatch = (req: Request, res: Response) => {
    try {
      const { subject, user, xpWager } = req.body;
      const match = quizBattleService.findMatch({ subject, user, xpWager });
      return res.status(200).json({
        success: true,
        data: match
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Matchmaking failed',
        error: error.message
      });
    }
  };

  public submitAnswer = (req: Request, res: Response) => {
    try {
      const { matchId, playerId, questionIndex, answerIndex, timeTakenSeconds } = req.body;
      const match = quizBattleService.submitAnswer({
        matchId,
        playerId,
        questionIndex,
        answerIndex,
        timeTakenSeconds: timeTakenSeconds || 5
      });

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: match
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to submit battle answer',
        error: error.message
      });
    }
  };

  public nextRound = (req: Request, res: Response) => {
    try {
      const { matchId } = req.params;
      const match = quizBattleService.nextRound(matchId);
      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: match
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to advance to next round',
        error: error.message
      });
    }
  };
}

export const quizBattleController = new QuizBattleController();
