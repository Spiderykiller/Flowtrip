/**
 * proxy.ts — route protection
 * 
 * IMPORTANT: /api/* routes must never be redirected — they return JSON
 * and must be handled by their own route handlers directly.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isPublic(pathname: string): boolean {
  // Never intercept API routes — let them handle their own auth
  if (pathname.startsWith('/api/')) return true;

  // Public pages
  const PUBLIC = [
                  '/',
                  '/login',
                  '/signup',
                  '/Destinations',
                  '/HowItWorks',
                  '/Community',
                  '/api/auth/callback',
                  '/api/auth/logout',
                ];
             
  const lower = pathname.toLowerCase();
  return PUBLIC.some((p) => lower === p || lower.startsWith(p + '/'));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get('base44_session')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};