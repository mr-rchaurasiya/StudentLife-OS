import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthTokens, UserRole } from '@studentlife/shared';

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string, role?: UserRole) => Promise<void>;
  oauthLogin: (provider: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted tokens & user on mount
    const savedUser = localStorage.getItem('studentlife_user');
    const savedTokens = localStorage.getItem('studentlife_tokens');

    if (savedUser && savedTokens) {
      try {
        setUser(JSON.parse(savedUser));
        setTokens(JSON.parse(savedTokens));
      } catch {
        localStorage.removeItem('studentlife_user');
        localStorage.removeItem('studentlife_tokens');
      }
    }
    setIsLoading(false);
  }, []);

  const saveAuthSession = (userData: User, tokensData: AuthTokens) => {
    setUser(userData);
    setTokens(tokensData);
    localStorage.setItem('studentlife_user', JSON.stringify(userData));
    localStorage.setItem('studentlife_tokens', JSON.stringify(tokensData));
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
      saveAuthSession(data.data.user, data.data.tokens);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName: string, email: string, password: string, role: UserRole = 'STUDENT') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
      saveAuthSession(data.data.user, data.data.tokens);
    } catch (err: any) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const oauthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/oauth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'OAuth authentication failed');
      }
      saveAuthSession(data.data.user, data.data.tokens);
    } catch (err: any) {
      setError(err.message || 'Failed OAuth login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (tokens?.refreshToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setTokens(null);
      localStorage.removeItem('studentlife_user');
      localStorage.removeItem('studentlife_tokens');
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        oauthLogin,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
