import { Request, Response } from 'express';
import { mockInterviewService } from '../services/mock-interview.service';
import { ApiResponse, StartInterviewDto, SubmitInterviewResponseDto } from '@studentlife/shared';

export class MockInterviewController {
  public startInterview = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: StartInterviewDto = req.body;
      const session = mockInterviewService.startSession(dto);
      const response: ApiResponse = {
        success: true,
        data: session,
        timestamp: new Date().toISOString()
      };
      res.status(201).json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'INTERVIEW_START_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public submitResponse = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: SubmitInterviewResponseDto = req.body;
      if (!dto.spokenAnswer) {
        res.status(400).json({
          success: false,
          error: { code: 'ANSWER_REQUIRED', details: 'Spoken answer is required' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = mockInterviewService.submitResponse(dto);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'SUBMIT_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public getSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const session = mockInterviewService.getSessionById(id);
      if (!session) {
        res.status(404).json({
          success: false,
          error: { code: 'SESSION_NOT_FOUND', details: 'Session not found' },
          timestamp: new Date().toISOString()
        });
        return;
      }
      res.json({
        success: true,
        data: session,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const mockInterviewController = new MockInterviewController();
