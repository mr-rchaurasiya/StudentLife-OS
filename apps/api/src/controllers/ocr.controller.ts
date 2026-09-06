import { Request, Response } from 'express';
import { OcrService } from '../services/ocr.service';
import { ApiResponse } from '@studentlife/shared';

export class OcrController {
  public static scanDocument(req: Request, res: Response): void {
    const scanResult = OcrService.processScan(req.body);
    const response: ApiResponse<typeof scanResult> = {
      success: true,
      data: scanResult,
      message: 'Document successfully scanned and analyzed! ✨',
      timestamp: new Date().toISOString()
    };
    res.json(response);
  }
}
