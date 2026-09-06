import { Request, Response } from 'express';
import { codeSandboxService } from '../services/code-sandbox.service';
import { ApiResponse, ExecuteCodeDto, VisualizeAlgorithmDto } from '@studentlife/shared';

export class CodeSandboxController {
  public executeCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: ExecuteCodeDto = req.body;
      if (!dto.code) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_CODE', details: 'Code content is required' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = codeSandboxService.executeCode(dto);
      const response: ApiResponse = {
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'EXECUTION_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public visualizeAlgorithm = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: VisualizeAlgorithmDto = req.body;
      const result = codeSandboxService.getAlgorithmVisualization(dto);
      res.json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'VISUALIZATION_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const codeSandboxController = new CodeSandboxController();
