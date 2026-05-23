/**
 * GET /api/auth/me
 *
 * Reads the base44_session cookie and decodes the JWT payload locally.
 * Then merges the NeonDB user profile on top so that any profile updates
 * (full_name, avatar_url) are reflected immediately without a new login.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const json = Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('base44_session')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'unauthorized', message: 'No session found.' },
      { status: 401 }
    );
  }

  const payload = decodeJwtPayload(token);

  if (!payload) {
    return NextResponse.json(
      { error: 'unauthorized', message: 'Invalid session token.' },
      { status: 401 }
    );
  }

  // Check token expiry
  if (payload.exp && typeof payload.exp === 'number') {
    const nowSeconds = Math.floor(Date.now() / 1000);
    if (nowSeconds > payload.exp) {
      return NextResponse.json(
        { error: 'unauthorized', message: 'Session expired. Please sign in again.' },
        { status: 401 }
      );
    }
  }

  // Base identity from JWT
  const userId = (payload.sub ?? payload.id ?? payload.user_id ?? '') as string;
  const jwtUser = {
    id: userId,
    email: (payload.email ?? '') as string,
    full_name: (payload.full_name ?? payload.name ?? '') as string,
    role: (payload._app_role ?? payload.role ?? 'user') as string,
    avatar_url: (payload.avatar_url ?? null) as string | null,
  };

  // Merge NeonDB profile — gives priority to user-updated fields
  try {
    const [dbUser] = await db.select().from(users).where(eq(users.id, userId));
    if (dbUser) {
      return NextResponse.json({
        ...jwtUser,
        // NeonDB wins for these fields if set
        full_name: dbUser.full_name || jwtUser.full_name,
        avatar_url: dbUser.avatar_url || jwtUser.avatar_url,
      });
    }
  } catch {
    // DB unavailable — fall through to JWT-only response
  }

  return NextResponse.json(jwtUser);
}