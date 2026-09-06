import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@studentlife/shared';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const response: ApiResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    error: {
      code: err.code || 'INTERNAL_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.details || err.stack : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};
