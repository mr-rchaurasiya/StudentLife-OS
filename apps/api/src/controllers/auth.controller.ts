import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse, AuthResponseData, AuthTokens, User } from '@studentlife/shared';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, role } = req.body;
      if (!email || !password || !fullName) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and full name are required.',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await AuthService.register({ email, password, fullName, role });
      const response: ApiResponse<AuthResponseData> = {
        success: true,
        message: 'Student account registered successfully!',
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required.',
          timestamp: new Date().toISOString(),
        });
      }

      const result = await AuthService.login({ email, password });
      const response: ApiResponse<AuthResponseData> = {
        success: true,
        message: 'Welcome back to StudentLife OS!',
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required.',
          timestamp: new Date().toISOString(),
        });
      }

      const tokens = await AuthService.refresh(refreshToken);
      const response: ApiResponse<AuthTokens> = {
        success: true,
        message: 'Tokens refreshed successfully',
        data: tokens,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = await AuthService.getUserById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const response: ApiResponse<{ user: User }> = {
        success: true,
        data: { user },
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await AuthService.logout(refreshToken);
      const response: ApiResponse = {
        success: true,
        message: 'Logged out successfully',
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async oauthDemo(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = req.body; // 'google' | 'github'
      const mockProfile = provider === 'github' ? {
        email: 'developer@github.studentlifeos.dev',
        name: 'GitHub Octocat',
        avatarUrl: 'https://avatars.githubusercontent.com/u/9919?v=4',
      } : {
        email: 'google.learner@gmail.com',
        name: 'Google Learner',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      };

      const result = await AuthService.oauthLogin(provider || 'google', mockProfile);
      const response: ApiResponse<AuthResponseData> = {
        success: true,
        message: `Authenticated with ${provider || 'Google'} OAuth successfully!`,
        data: result,
        timestamp: new Date().toISOString(),
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
