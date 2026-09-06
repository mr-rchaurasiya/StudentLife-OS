import { Request, Response } from 'express';
import { voiceTutorService } from '../services/voice-tutor.service';

export class VoiceTutorController {
  public respondToVoice = async (req: Request, res: Response) => {
    try {
      const { transcript, persona, languageMode, currentSubject } = req.body;
      if (!transcript) {
        return res.status(400).json({
          success: false,
          message: 'Transcript is required'
        });
      }

      const response = await voiceTutorService.respondToVoice({
        transcript,
        persona,
        languageMode,
        currentSubject
      });

      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Voice reasoning failed',
        error: error.message
      });
    }
  };

  public getDrills = (req: Request, res: Response) => {
    try {
      const drills = voiceTutorService.getOralDrills();
      return res.status(200).json({
        success: true,
        data: drills
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch oral drills',
        error: error.message
      });
    }
  };

  public evaluateOralAnswer = (req: Request, res: Response) => {
    try {
      const { drillId, spokenAnswer } = req.body;
      const evaluation = voiceTutorService.evaluateOralAnswer({
        drillId: drillId || 'drill-1',
        spokenAnswer: spokenAnswer || ''
      });

      return res.status(200).json({
        success: true,
        data: evaluation
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Oral answer evaluation failed',
        error: error.message
      });
    }
  };
}

export const voiceTutorController = new VoiceTutorController();
