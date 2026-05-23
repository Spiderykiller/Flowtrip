/**
 * GET  /api/user/profile  — fetch current user's full profile from DB
 * PATCH /api/user/profile  — update profile fields
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users } from '@/db';
import { eq } from 'drizzle-orm';
import { decodeJwtPayload } from '@/lib/jwt';

async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('base44_session')?.value;
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload?.sub && !payload?.id) return null;
  return (payload.sub ?? payload.id) as string;
}

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    // ── NEW: auto-create profile on first visit ──
    if (!user) {
      const cookieStore = await cookies();
      const token = cookieStore.get('base44_session')?.value;
      const payload = token ? decodeJwtPayload(token) : null;
      const [created] = await db.insert(users).values({
        id: userId,
        email: (payload?.email as string) ?? '',
        full_name: (payload?.full_name ?? payload?.name ?? '') as string,
      }).returning();
      return NextResponse.json(created);
    }
    // ── END NEW ──

    return NextResponse.json(user);
  } catch (err) {
    console.error('[/api/user/profile GET]', err);
    return NextResponse.json({ message: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }

  // Only allow safe fields to be updated
  const allowed = [
    'full_name', 'avatar_url', 'bio', 'location', 'website',
    'preferred_travel_style', 'preferred_climate', 'currency',
    'email_notifications', 'trip_reminders',
  ];

  const updates: Record<string, unknown> = { updated_at: new Date() };
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  try {
    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    if (!updated) {
      // User doesn't exist yet — create them
      const cookieStore = await cookies();
      const token = cookieStore.get('base44_session')?.value;
      const payload = token ? decodeJwtPayload(token) : null;

      const [created] = await db.insert(users).values({
        id: userId,
        email: (payload?.email as string) ?? '',
        full_name: (body.full_name as string) ?? (payload?.full_name as string) ?? null,
        ...updates,
      }).returning();

      return NextResponse.json(created);
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[/api/user/profile PATCH]', err);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}