/**
 * GET  /api/user/trips  — list user's saved trips
 * POST /api/user/trips  — save a new trip
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, saved_trips } from '@/db';
import { eq, desc } from 'drizzle-orm';
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
    const trips = await db
      .select()
      .from(saved_trips)
      .where(eq(saved_trips.user_id, userId))
      .orderBy(desc(saved_trips.created_at));

    return NextResponse.json(trips);
  } catch (err) {
    console.error('[/api/user/trips GET]', err);
    return NextResponse.json({ message: 'Failed to fetch trips' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

  if (!body.title || !body.destination) {
    return NextResponse.json(
      { message: 'Title and destination are required' },
      { status: 400 }
    );
  }

  try {
    const [trip] = await db.insert(saved_trips).values({
      user_id: userId,
      title: body.title as string,
      destination: body.destination as string,
      cover_image_url: body.cover_image_url as string ?? null,
      duration_days: body.duration_days as string ?? null,
      budget: body.budget as string ?? null,
      itinerary: body.itinerary ?? null,
      notes: body.notes as string ?? null,
      is_public: (body.is_public as boolean) ?? false,
    }).returning();

    return NextResponse.json(trip, { status: 201 });
  } catch (err) {
    console.error('[/api/user/trips POST]', err);
    return NextResponse.json({ message: 'Failed to save trip' }, { status: 500 });
  }
}