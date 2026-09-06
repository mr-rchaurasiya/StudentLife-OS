import { Request, Response } from 'express';
import { customPaperService } from '../services/custom-paper.service';
import { ApiResponse, GenerateMockPaperDto } from '@studentlife/shared';

export class CustomPaperController {
  public getAllPapers = async (_req: Request, res: Response): Promise<void> => {
    try {
      const papers = customPaperService.getAllPapers();
      const response: ApiResponse = {
        success: true,
        data: papers,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PAPERS_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public getPaperById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const paper = customPaperService.getPaperById(id);
      if (!paper) {
        res.status(404).json({
          success: false,
          error: { code: 'PAPER_NOT_FOUND', details: `Paper ${id} not found` },
          timestamp: new Date().toISOString()
        });
        return;
      }
      res.json({
        success: true,
        data: paper,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PAPER_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public generateMockPaper = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: GenerateMockPaperDto = req.body;
      if (!dto.examType || !dto.subject) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_REQUEST', details: 'examType and subject are required' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const generated = customPaperService.generateMockPaper(dto);
      res.status(201).json({
        success: true,
        message: 'Mock Paper synthesized successfully',
        data: generated,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PAPER_GENERATE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const customPaperController = new CustomPaperController();
