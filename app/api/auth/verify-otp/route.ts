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

/** POST /api/auth/verify-otp — verify code, then auto-login */
export async function POST(request: Request) {
  let email: string, otpCode: string, password: string;

  try {
    ({ email, otpCode, password } = await request.json());
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  if (!email || !otpCode) {
    return NextResponse.json(
      { message: 'Email and verification code are required.' },
      { status: 400 }
    );
  }

  const base44 = createClient({ appId: appParams.appId });

  // Step 1: Verify OTP
  try {
    await base44.auth.verifyOtp({ email: email.trim(), otpCode: otpCode.trim() });
  } catch (err: unknown) {
    const message = getErrorMessage(err).toLowerCase();
    if (message.includes('invalid') || message.includes('expired') || message.includes('incorrect')) {
      return NextResponse.json(
        { message: 'Invalid or expired code. Please try again or request a new one.' },
        { status: 400 }
      );
    }
    console.error('[/api/auth/verify-otp] verifyOtp failed:', getErrorMessage(err) || err);
    return NextResponse.json(
      { message: 'Verification failed. Please try again.' },
      { status: 502 }
    );
  }

  // Step 2: Auto-login after verification
  if (!password) {
    return NextResponse.json({ verified: true, needsLogin: true });
  }

  try {
    const { access_token, user } = await base44.auth.loginViaEmailPassword(
      email.trim(),
      password
    );

    const response = NextResponse.json({ verified: true, user });
    response.cookies.set('base44_session', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;

  } catch (err) {
    console.error('[/api/auth/verify-otp] login after verify failed:', getErrorMessage(err) || err);
    return NextResponse.json({ verified: true, needsLogin: true });
  }
}

/** PUT /api/auth/verify-otp — resend OTP */
export async function PUT(request: Request) {
  let email: string;

  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  try {
    const base44 = createClient({ appId: appParams.appId });
    await base44.auth.resendOtp(email.trim());
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[/api/auth/verify-otp] resendOtp failed:', getErrorMessage(err) || err);
    return NextResponse.json(
      { message: 'Failed to resend code. Please try again.' },
      { status: 502 }
    );
  }
}