/**
 * POST /api/auth/logout
 *
 * Clears the base44_session cookie.
 * Base44 tokens are stateless JWTs so there's no server-side invalidation call needed.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('base44_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // deletes the cookie
  });

  return response;
}