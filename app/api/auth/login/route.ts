import { NextResponse } from 'next/server';
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

/** Extract the most useful message from a Base44Error or standard Error */
function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    // Base44Error has err.data.message
    const data = (err as Record<string, unknown>).data;
    if (data && typeof data === 'object') {
      const msg = (data as Record<string, unknown>).message;
      if (typeof msg === 'string') return msg;
    }
    // Fallback to err.message
    const msg = (err as Record<string, unknown>).message;
    if (typeof msg === 'string') return msg;
  }
  return '';
}

export async function POST(request: Request) {
  let email: string, password: string;

  try {
    ({ email, password } = await request.json());
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { message: 'Email and password are required.' },
      { status: 400 }
    );
  }

  try {
    const base44 = createClient({ appId: appParams.appId });
    const { access_token, user } = await base44.auth.loginViaEmailPassword(
      email.trim(),
      password
    );

    const response = NextResponse.json({ user });
    response.cookies.set('base44_session', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;

  } catch (err: unknown) {
    const message = getErrorMessage(err);
    const lower = message.toLowerCase();

    if (lower.includes('verify') || lower.includes('verification') || lower.includes('email before')) {
      return NextResponse.json(
        {
          message: 'Please verify your email first. Check your inbox for a verification code.',
          code: 'email_not_verified',
        },
        { status: 400 }
      );
    }

    if (lower.includes('not_deployed') || lower.includes('not yet available')) {
      return NextResponse.json(
        { message: 'Auth service unavailable. Try again later.' },
        { status: 503 }
      );
    }

    if (lower.includes('invalid') || lower.includes('password') || lower.includes('not registered') || lower.includes('incorrect')) {
      return NextResponse.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    console.error('[/api/auth/login] unhandled error:', message || err);
    return NextResponse.json(
      { message: message || 'Sign-in failed. Please try again.' },
      { status: 502 }
    );
  }
}