
'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import api from '@/lib/api';
import type { User, AuthResponse } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => Promise<void>;
  isOwner: boolean;
  isManager: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session using the HttpOnly refresh cookie.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const { data } = await api.post<User>('/api/auth/refresh');

        if (!cancelled) {
          setUser(data);

          try {
            localStorage.setItem('user', JSON.stringify(data));
          } catch {
            // Session still works if local storage is unavailable.
          }
        }
      } catch {
        if (!cancelled) {
          setUser(null);

          try {
            localStorage.removeItem('user');
          } catch {
            // Ignore storage errors.
          }
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((data: AuthResponse) => {
    setUser(data);

    try {
      localStorage.setItem('user', JSON.stringify(data));
    } catch {
      // Authentication uses HttpOnly cookies, not local storage.
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Clear local state even if the logout request fails.
    } finally {
      setUser(null);

      try {
        localStorage.removeItem('user');
      } catch {
        // Ignore storage errors.
      }
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    login,
    logout,
    isOwner: user?.role === 'OWNER',
    isManager: user?.role === 'MANAGER',
    isSuperAdmin: user?.role === 'SUPER_ADMIN',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
