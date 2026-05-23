'use client';

import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/Usernotregisterederror';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin" />
  </div>
);

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  unauthenticatedElement?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback = <DefaultFallback />,
  unauthenticatedElement,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, authError } = useAuth();

  // Still resolving session
  if (isLoading) {
    return fallback;
  }

  // Unregistered user
  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  // Not authenticated
  if (!isAuthenticated) {
    if (unauthenticatedElement) return unauthenticatedElement;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-slate-600">
        <p className="mb-4">You are not authenticated</p>
        <button
          onClick={() => (window.location.href = '/')}
          className="px-4 py-2 rounded bg-black text-white"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return <>{children}</>;
}