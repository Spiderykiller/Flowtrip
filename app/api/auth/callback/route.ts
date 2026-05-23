/**
 * GET /api/auth/callback
 *
 * Base44 OAuth redirects here after Google/social login.
 * Receives the token as a query param, sets it as an HTTP-only cookie,
 * then sends the user to /dashboard.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
  }

  const response = NextResponse.redirect(new URL('/', request.url));

  response.cookies.set('base44_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}