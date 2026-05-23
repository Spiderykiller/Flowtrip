import { NextResponse } from 'next/server';
import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const data = (err as Record<string, unknown>).data;
    if (data && typeof data === 'object') {
      const msg = (data as Record<string, unknown>).message;
      if (typeof msg === 'string') return msg;
    }
    const msg = (err as Record<string, unknown>).message;
    if (typeof msg === 'string') return msg;
  }
  return '';
}

export async function POST(request: Request) {
  let email: string, password: string, full_name: string;

  try {
    ({ email, password, full_name } = await request.json());
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !password || !full_name) {
    return NextResponse.json({ message: 'Name, email, and password are required.' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ message: 'Password must be at least 8 characters.' }, { status: 400 });
  }

  const base44 = createClient({ appId: appParams.appId });

  // Step 1: Register
  try {
    await base44.auth.register({ email: email.trim(), password });
  } catch (err: unknown) {
    const message = getErrorMessage(err).toLowerCase();
    if (message.includes('exists') || message.includes('already') || message.includes('registered')) {
      // Account exists — fall through to login attempt below
      // so unverified existing users can still get to OTP step
    } else {
      console.error('[/api/auth/signup] register failed:', getErrorMessage(err) || err);
      return NextResponse.json({ message: 'Sign-up failed. Please try again.' }, { status: 502 });
    }
  }

  // Step 2: Try login
  try {
    const { access_token, user } = await base44.auth.loginViaEmailPassword(email.trim(), password);

    base44.auth.setToken(access_token, false);
    await base44.auth.updateMe({ full_name: full_name.trim() }).catch(() => {
      console.warn('[/api/auth/signup] updateMe failed (non-fatal)');
    });

    const response = NextResponse.json({ user: { ...user, full_name: full_name.trim() } });
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
          message: 'Account created! Check your email for a verification code before signing in.',
          code: 'email_not_verified',
        },
        { status: 200 }
      );
    }

    if (lower.includes('invalid') || lower.includes('password') || lower.includes('incorrect')) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }

    console.error('[/api/auth/signup] login after register failed:', message || err);
    return NextResponse.json(
      { message: 'Account created but sign-in failed. Please go to the login page.' },
      { status: 502 }
    );
  }
}
