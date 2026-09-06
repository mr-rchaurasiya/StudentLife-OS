import { Request, Response } from 'express';
import { aiPodcastService } from '../services/ai-podcast.service';
import { ApiResponse, GeneratePodcastDto } from '@studentlife/shared';

export class AiPodcastController {
  public getAllPodcasts = async (_req: Request, res: Response): Promise<void> => {
    try {
      const podcasts = aiPodcastService.getAllPodcasts();
      const response: ApiResponse = {
        success: true,
        data: podcasts,
        timestamp: new Date().toISOString()
      };
      res.json(response);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PODCAST_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public getPodcastById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const podcast = aiPodcastService.getPodcastById(id);
      if (!podcast) {
        res.status(404).json({
          success: false,
          error: { code: 'PODCAST_NOT_FOUND', details: `Podcast ${id} not found` },
          timestamp: new Date().toISOString()
        });
        return;
      }
      res.json({
        success: true,
        data: podcast,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PODCAST_FETCH_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };

  public generatePodcast = async (req: Request, res: Response): Promise<void> => {
    try {
      const dto: GeneratePodcastDto = req.body;
      if (!dto.topic) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_REQUEST', details: 'topic is required' },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const generated = aiPodcastService.generatePodcast(dto);
      res.status(201).json({
        success: true,
        message: 'AI 2-Host Dialogue Podcast synthesized successfully',
        data: generated,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: { code: 'PODCAST_GENERATE_FAILED', details: error.message },
        timestamp: new Date().toISOString()
      });
    }
  };
}

export const aiPodcastController = new AiPodcastController();
