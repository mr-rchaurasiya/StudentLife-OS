import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole, User } from '@studentlife/shared';
import { ENV } from '../config/env';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
    fullName: string;
  };
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
      error: { code: 'UNAUTHORIZED' },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err: any) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired access token.',
      error: { code: 'INVALID_TOKEN' },
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireRoles = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        error: { code: 'UNAUTHORIZED' },
        timestamp: new Date().toISOString(),
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Requires one of [${allowedRoles.join(', ')}] roles.`,
        error: { code: 'INSUFFICIENT_PERMISSIONS' },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
};
