'use client';

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';

export type UserRole = 'admin' | 'user' | 'guest';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
}

interface AuthError {
  type: 'auth_required' | 'user_not_registered' | 'app_error' | 'unknown';
  message: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: AuthError | null;
  loginWithOAuth: () => void;
  /**
   * Returns null on success, or an error string.
   * Returns { code: 'email_not_verified', message: string } when email needs verification.
   */
  loginWithPassword: (email: string, password: string) => Promise<string | null>;
  /**
   * Returns null on success, or an error string.
   * Returns { code: 'email_not_verified', message: string } when email needs verification (account was created).
   */
  signupWithPassword: (fullName: string, email: string, password: string) => Promise<{ code: string; message: string } | null>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<AuthError | null>(null);
  const initialized = useRef(false);

  const fetchUser = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const res = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
        cache: 'no-store',
      });

      if (res.status === 401) {
        setUser(null);
        setAuthError({ type: 'auth_required', message: 'Please sign in to continue.' });
        return;
      }

      if (res.status === 403) {
        const body = await res.json().catch(() => ({}));
        setUser(null);
        setAuthError({
          type: body?.reason === 'user_not_registered' ? 'user_not_registered' : 'app_error',
          message: body?.message ?? 'Access denied.',
        });
        return;
      }

      if (!res.ok) throw new Error(`Unexpected status ${res.status}`);

      const data: AuthUser = await res.json();
      setUser(data);
      setAuthError(null);
    } catch (err) {
      console.error('[AuthContext] fetchUser failed:', err);
      setUser(null);
      setAuthError({ type: 'unknown', message: 'Failed to verify session.' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    fetchUser();
  }, [fetchUser]);

  const loginWithOAuth = useCallback(() => {
    const callbackUrl = `${window.location.origin}/api/auth/callback`;
    window.location.href = `/login?method=oauth&callbackUrl=${encodeURIComponent(callbackUrl)}`;
  }, []);

  const loginWithPassword = useCallback(
    async (email: string, password: string): Promise<string | null> => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Surface the verification message directly to the UI
          return data?.message ?? 'Sign-in failed. Please try again.';
        }

        await fetchUser();
        return null;
      } catch (err) {
        console.error('[AuthContext] loginWithPassword failed:', err);
        return 'Unable to connect. Please check your internet connection.';
      }
    },
    [fetchUser]
  );

  const signupWithPassword = useCallback(
    async (
      fullName: string,
      email: string,
      password: string
    ): Promise<{ code: string; message: string } | null> => {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, full_name: fullName }),
        });

        const data = await res.json();

        // Account created but needs email verification — not an error
        if (res.ok && data?.code === 'email_not_verified') {
          return { code: 'email_not_verified', message: data.message };
        }

        if (!res.ok) {
          return { code: 'error', message: data?.message ?? 'Sign-up failed. Please try again.' };
        }

        await fetchUser();
        return null; // null = fully signed in
      } catch (err) {
        console.error('[AuthContext] signupWithPassword failed:', err);
        return { code: 'error', message: 'Unable to connect. Please check your internet connection.' };
      }
    },
    [fetchUser]
  );

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // swallow
    }
    setUser(null);
    setAuthError(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        authError,
        loginWithOAuth,
        loginWithPassword,
        signupWithPassword,
        logout,
        refresh: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}