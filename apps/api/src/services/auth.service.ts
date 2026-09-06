import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole, RegisterDto, LoginDto, AuthTokens, AuthResponseData } from '@studentlife/shared';
import { ENV } from '../config/env';

// In-memory data store for resilient execution & zero-friction startup
interface StoredUser extends User {
  passwordHash: string;
}

const usersDb = new Map<string, StoredUser>();
const refreshTokensDb = new Set<string>();

// Pre-seed a default student & mentor account for instant testing
const seedDefaultUsers = async () => {
  if (usersDb.size > 0) return;
  
  const defaultSalt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('student123', defaultSalt);
  
  const demoStudent: StoredUser = {
    id: 'demo-student-uuid-01',
    email: 'student@studentlifeos.dev',
    fullName: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    role: 'STUDENT',
    isEmailVerified: true,
    passwordHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const demoMentor: StoredUser = {
    id: 'demo-mentor-uuid-02',
    email: 'mentor@studentlifeos.dev',
    fullName: 'Dr. Priya Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    role: 'MENTOR',
    isEmailVerified: true,
    passwordHash,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  usersDb.set(demoStudent.email.toLowerCase(), demoStudent);
  usersDb.set(demoMentor.email.toLowerCase(), demoMentor);
};

seedDefaultUsers();

export class AuthService {
  private static generateTokens(user: User): AuthTokens {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const accessToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: '7d' });

    refreshTokensDb.add(refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 mins in seconds
    };
  }

  static async register(dto: RegisterDto): Promise<AuthResponseData> {
    const normalizedEmail = dto.email.toLowerCase().trim();

    if (usersDb.has(normalizedEmail)) {
      const error: any = new Error('An account with this email already exists');
      error.statusCode = 400;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    if (!dto.password || dto.password.length < 6) {
      const error: any = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      error.code = 'WEAK_PASSWORD';
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const newUser: StoredUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: normalizedEmail,
      fullName: dto.fullName.trim(),
      role: dto.role || 'STUDENT',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(dto.fullName)}`,
      isEmailVerified: false,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    usersDb.set(normalizedEmail, newUser);

    const { passwordHash: _, ...publicUser } = newUser;
    const tokens = this.generateTokens(publicUser);

    return {
      user: publicUser,
      tokens,
    };
  }

  static async login(dto: LoginDto): Promise<AuthResponseData> {
    const normalizedEmail = dto.email.toLowerCase().trim();
    const storedUser = usersDb.get(normalizedEmail);

    if (!storedUser) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await bcrypt.compare(dto.password, storedUser.passwordHash);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const { passwordHash: _, ...publicUser } = storedUser;
    const tokens = this.generateTokens(publicUser);

    return {
      user: publicUser,
      tokens,
    };
  }

  static async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken || !refreshTokensDb.has(refreshToken)) {
      const error: any = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_REFRESH_TOKEN';
      throw error;
    }

    try {
      const decoded: any = jwt.verify(refreshToken, ENV.JWT_SECRET);
      const storedUser = Array.from(usersDb.values()).find(u => u.id === decoded.id);

      if (!storedUser) {
        const error: any = new Error('User no longer exists');
        error.statusCode = 401;
        throw error;
      }

      // Invalidate old refresh token and rotate
      refreshTokensDb.delete(refreshToken);

      const { passwordHash: _, ...publicUser } = storedUser;
      return this.generateTokens(publicUser);
    } catch (err: any) {
      const error: any = new Error('Session expired. Please log in again.');
      error.statusCode = 401;
      error.code = 'SESSION_EXPIRED';
      throw error;
    }
  }

  static async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) {
      refreshTokensDb.delete(refreshToken);
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    const stored = Array.from(usersDb.values()).find(u => u.id === id);
    if (!stored) return null;
    const { passwordHash: _, ...publicUser } = stored;
    return publicUser;
  }

  static async oauthLogin(provider: 'google' | 'github', profile: { email: string; name: string; avatarUrl?: string }): Promise<AuthResponseData> {
    const normalizedEmail = profile.email.toLowerCase().trim();
    let storedUser = usersDb.get(normalizedEmail);

    if (!storedUser) {
      const randomPassword = Math.random().toString(36).substring(2) + Date.now();
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      storedUser = {
        id: `usr-oauth-${Date.now()}`,
        email: normalizedEmail,
        fullName: profile.name,
        avatarUrl: profile.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profile.name)}`,
        role: 'STUDENT',
        isEmailVerified: true,
        passwordHash,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      usersDb.set(normalizedEmail, storedUser);
    }

    const { passwordHash: _, ...publicUser } = storedUser;
    const tokens = this.generateTokens(publicUser);

    return {
      user: publicUser,
      tokens,
    };
  }
}
