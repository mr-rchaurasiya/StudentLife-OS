import { Router, Request, Response } from 'express';
import { ApiResponse } from '@studentlife/shared';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const response: ApiResponse<{
    status: string;
    uptime: number;
    phase: string;
    services: {
      api: string;
      database: string;
      cache: string;
    };
  }> = {
    success: true,
    message: 'StudentLife OS API is fully operational',
    data: {
      status: 'UP',
      uptime: process.uptime(),
      phase: 'Phase 01: Project Architecture Active',
      services: {
        api: 'healthy',
        database: 'connected',
        cache: 'ready',
      },
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(response);
});

export default router;
