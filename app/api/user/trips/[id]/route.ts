/**
 * DELETE /api/user/trips/[id]  — delete a saved trip by ID
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, saved_trips } from '@/db';
import { eq, and } from 'drizzle-orm';
import { decodeJwtPayload } from '@/lib/jwt';

async function getAuthenticatedUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('base44_session')?.value;
  if (!token) return null;
  const payload = decodeJwtPayload(token);
  if (!payload?.sub && !payload?.id) return null;
  return (payload.sub ?? payload.id) as string;
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [deleted] = await db
      .delete(saved_trips)
      .where(and(eq(saved_trips.id, id), eq(saved_trips.user_id, userId)))
      .returning();

    if (!deleted) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/user/trips/[id] DELETE]', err);
    return NextResponse.json({ message: 'Failed to delete trip' }, { status: 500 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const [trip] = await db
      .select()
      .from(saved_trips)
      .where(and(eq(saved_trips.id, id), eq(saved_trips.user_id, userId)));

    if (!trip) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
    }

    return NextResponse.json(trip);
  } catch (err) {
    console.error('[/api/user/trips/[id] GET]', err);
    return NextResponse.json({ message: 'Failed to fetch trip' }, { status: 500 });
  }
}