'use client';

/**
 * AuthGuard
 *
 * Wrap any page or layout that requires authentication.
 * Shows a loading state while auth resolves, redirects to /login if not authed.
 *
 * Usage:
 *   export default function DashboardPage() {
 *     return (
 *       <AuthGuard>
 *         <Dashboard />
 *       </AuthGuard>
 *     );
 *   }
 *
 * For role-based access, pass `requiredRole`:
 *   <AuthGuard requiredRole="admin">...</AuthGuard>
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth, type UserRole } from '@/lib/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, requiredRole, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login`);
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, requiredRole, user, router, pathname]);

  if (isLoading) {
    return fallback ?? <AuthLoadingScreen />;
  }

  if (!isAuthenticated) return null;

  if (requiredRole && user?.role !== requiredRole) return null;

  return <>{children}</>;
}

function AuthLoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background-tertiary)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Spinner />
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          Checking your session…
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="14" cy="14" r="12" stroke="var(--color-border-tertiary)" strokeWidth="2.5" />
      <path
        d="M14 2 A12 12 0 0 1 26 14"
        stroke="var(--color-text-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}