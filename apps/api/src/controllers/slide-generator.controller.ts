import { Request, Response } from 'express';
import { slideGeneratorService } from '../services/slide-generator.service';
import { ApiResponse, GenerateSlidesDto } from '@studentlife/shared';

export class SlideGeneratorController {
  public getAllDecks = async (_req: Request, res: Response): Promise<void> => {
    try {
      const decks = slideGeneratorService.getAllDecks();
      const response: ApiResponse = {
        success: true,
        data: decks,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'DECKS_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public getDeckById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deck = slideGeneratorService.getDeckById(id);
      if (!deck) {
        res.status(404).json({
          success: false,
          error: { code: 'DECK_NOT_FOUND', details: `Deck ${id} not found` },
          timestamp: new Date().toISOString()
        });
        return;
      }
      res.json({
        success: true,
        data: deck,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'DECK_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public generateDeck = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: GenerateSlidesDto = req.body;
      if (!dto.topic) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_REQUEST', details: 'Topic is required' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const generated = slideGeneratorService.generateDeck(dto);
      res.status(201).json({
        success: true,
        message: 'AI Visual Slide Deck synthesized successfully',
        data: generated,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'SLIDE_GENERATE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const slideGeneratorController = new SlideGeneratorController();
