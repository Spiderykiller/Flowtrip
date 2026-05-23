'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { base44 } from '@/lib/base44Client';

type FormState = 'idle' | 'submitting' | 'oauth_redirecting';
type Step = 'login' | 'verify';

export default function LoginPage() {
  const { isAuthenticated, isLoading, loginWithPassword, refresh } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // OTP step
  const [step, setStep] = useState<Step>('login');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [formState, setFormState] = useState<FormState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const errorParam = searchParams.get('error');
  const verifiedParam = searchParams.get('verified');

  useEffect(() => {
    emailRef.current?.focus();
    if (errorParam === 'missing_token') setError('Sign-in failed. Please try again.');
    if (verifiedParam === '1') setSuccess('✓ Email verified! You can now sign in.');
  }, [errorParam, verifiedParam]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/');
  }, [isAuthenticated, isLoading, router]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  // ── Login submit ───────────────────────────────────────────────────────────

  async function handleEmailLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    if (formState !== 'idle') return;
    setError(null);
    setSuccess(null);

    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password) { setError('Please enter your password.'); return; }

    setFormState('submitting');
    const err = await loginWithPassword(email.trim(), password);
    setFormState('idle');

    if (!err) {
      router.replace('/');
      return;
    }

    // Unverified email — switch to OTP step
    if (err.toLowerCase().includes('verify your email') || err.toLowerCase().includes('verification')) {
      // Request a fresh OTP
      await fetch('/api/auth/verify-otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      }).catch(() => null);

      setResendCooldown(60);
      setStep('verify');
      setSuccess('A verification code has been sent to your email.');
      setError(null);
      return;
    }

    setError(err);
  }

  // ── OTP submit ─────────────────────────────────────────────────────────────

  async function handleVerify(e: React.SyntheticEvent) {
    e.preventDefault();
    if (formState !== 'idle') return;
    setError(null);
    setSuccess(null);

    const code = otp.join('');
    if (code.length < 6) { setError('Please enter the full 6-digit code.'); return; }

    setFormState('submitting');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), otpCode: code, password }),
      });

      const data = await res.json();
      setFormState('idle');

      if (!res.ok) {
        setError(data?.message ?? 'Verification failed. Please try again.');
        return;
      }

      if (data.needsLogin) {
        setSuccess('Email verified! Signing you in…');
        const err = await loginWithPassword(email.trim(), password);
        if (!err) { router.replace('/'); return; }
        setError(err);
        return;
      }

      await refresh();
      router.replace('/');
    } catch {
      setError('Unable to connect. Please try again.');
      setFormState('idle');
    }
  }

  // ── Resend OTP ─────────────────────────────────────────────────────────────

  async function handleResend() {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setSuccess('A new code has been sent to your email.');
        setResendCooldown(60);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    } catch {
      setError('Unable to connect. Please try again.');
    }
  }

  // ── OTP input handling ─────────────────────────────────────────────────────

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    digits.split('').forEach((d, i) => { next[i] = d; });
    setOtp(next);
    otpRefs.current[Math.min(digits.length, 5)]?.focus();
  }

  function handleOAuth() {
    setFormState('oauth_redirecting');
    setError(null);
    const callbackUrl = `${window.location.origin}/api/auth/callback`;
    base44.auth.loginWithProvider('google', callbackUrl);
  }

  if (isLoading || isAuthenticated) return <FullScreenLoader />;

  const busy = formState !== 'idle';

  return (
    <div style={s.root}>
      {/* Left panel */}
      <div style={s.panel}>
        <div style={s.panelInner}>
          <Logo />
          <div style={s.panelText}>
            <h1 style={s.headline}>Your next<br />adventure<br />awaits.</h1>
            <p style={s.tagline}>Plan smarter. Explore deeper.</p>
          </div>
          <div style={s.dots} aria-hidden />
        </div>
      </div>

      {/* Right panel */}
      <div style={s.form}>
        <div style={s.formInner}>
          <div style={s.mobileLogoRow}>
            <Logo size={22} />
            <span style={s.mobileLogoText}>TravelApp</span>
          </div>

          {/* ── STEP: VERIFY OTP ── */}
          {step === 'verify' ? (
            <>
              <div style={s.otpIconWrap}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="10" fill="#d4a84720"/>
                  <path d="M8 11a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H10a2 2 0 01-2-2V11z" stroke="#d4a847" strokeWidth="1.5"/>
                  <path d="M8 13l8 5 8-5" stroke="#d4a847" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>

              <h2 style={s.title}>Verify your email</h2>
              <p style={s.sub}>
                We sent a 6-digit code to{' '}
                <span style={{ color: '#d4a847', fontWeight: 500 }}>{email}</span>.
                Enter it below to continue.
              </p>

              {success && <div style={s.successBox}>{success}</div>}
              {error && <div style={s.errorBox} role="alert">{error}</div>}

              <form onSubmit={handleVerify} noValidate>
                <div style={s.otpRow} onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      disabled={busy}
                      style={{
                        ...s.otpInput,
                        borderColor: digit ? '#d4a847' : '#1a2a38',
                        color: digit ? '#d4a847' : '#d0e0e8',
                      }}
                    />
                  ))}
                </div>

                <button type="submit" disabled={busy || otp.join('').length < 6} style={s.submitBtn}>
                  {formState === 'submitting' ? <><Spinner /> Verifying…</> : 'Verify & sign in'}
                </button>
              </form>

              <div style={s.resendRow}>
                <span style={s.resendText}>Didn't receive a code?</span>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  style={{ ...s.resendBtn, opacity: resendCooldown > 0 ? 0.4 : 1 }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>

              <button
                onClick={() => { setStep('login'); setOtp(['', '', '', '', '', '']); setError(null); setSuccess(null); }}
                style={s.backBtn}
              >
                ← Back to sign in
              </button>
            </>
          ) : (
            /* ── STEP: LOGIN FORM ── */
            <>
              <h2 style={s.title}>Sign in</h2>
              <p style={s.sub}>Welcome back — let's get you somewhere.</p>

              <button onClick={handleOAuth} disabled={busy} style={s.oauthBtn}>
                {formState === 'oauth_redirecting' ? (
                  <><Spinner /> Redirecting…</>
                ) : (
                  <><GoogleIcon /> Continue with Google</>
                )}
              </button>

              <div style={s.divider}>
                <div style={s.dividerLine} />
                <span style={s.dividerLabel}>or</span>
                <div style={s.dividerLine} />
              </div>

              <form onSubmit={handleEmailLogin} noValidate>
                {success && <div style={s.successBox}>{success}</div>}
                {error && <div style={s.errorBox} role="alert">{error}</div>}

                <label style={s.label} htmlFor="email">Email</label>
                <input
                  id="email"
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={busy}
                  style={s.input}
                />

                <label style={{ ...s.label, marginTop: '14px' }} htmlFor="password">Password</label>
                <div style={s.passwordWrap}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={busy}
                    style={{ ...s.input, paddingRight: '44px', marginBottom: 0 }}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)} style={s.eyeBtn}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                <div style={s.forgotRow}>
                  <a href="/forgot-password" style={s.forgotLink}>Forgot password?</a>
                </div>

                <button type="submit" disabled={busy} style={s.submitBtn}>
                  {formState === 'submitting' ? <><Spinner /> Signing in…</> : 'Sign in'}
                </button>
              </form>

              <p style={s.switchText}>
                Don't have an account?{' '}
                <a href="/signup" style={s.switchLink}>Create one</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function FullScreenLoader() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#080e14' }}>
      <Spinner size={28} color="#d4a847" />
    </div>
  );
}

function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="11.5" stroke="#d4a847" strokeWidth="1.2" />
      <circle cx="13" cy="13" r="2.5" fill="#d4a847" />
      <path d="M13 3.5 L14.8 10.8 L13 9.8 L11.2 10.8 Z" fill="#d4a847" />
      <path d="M13 22.5 L11.2 15.2 L13 16.2 L14.8 15.2 Z" fill="#d4a847" opacity="0.4" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function Eye() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}

function EyeOff() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
}

function Spinner({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={{ animation: 'spin .7s linear infinite', display: 'inline-block', verticalAlign: 'middle' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <circle cx="7" cy="7" r="5.5" stroke={color} strokeWidth="1.5" strokeOpacity=".25"/>
      <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: { display: 'flex', minHeight: '100vh', fontFamily: "'DM Sans', system-ui, sans-serif", background: '#080e14' },
  panel: { flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', background: 'linear-gradient(145deg, #0a1520 0%, #0f1e2e 40%, #152030 100%)' },
  panelInner: { position: 'relative', zIndex: 1, padding: '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' },
  panelText: { marginTop: 'auto', paddingBottom: '24px' },
  headline: { fontSize: '52px', fontWeight: 700, color: '#eee5cf', lineHeight: 1.12, letterSpacing: '-1px', margin: '0 0 16px', fontFamily: "'Georgia', 'Times New Roman', serif" },
  tagline: { fontSize: '15px', color: '#5a7080', letterSpacing: '0.6px', margin: 0 },
  dots: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, #d4a847 1px, transparent 1px)', backgroundSize: '44px 44px', opacity: 0.055, pointerEvents: 'none' },
  form: { width: '460px', flexShrink: 0, background: '#080e14', borderLeft: '1px solid #141e28', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px' },
  formInner: { width: '100%', maxWidth: '360px' },
  mobileLogoRow: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '36px' },
  mobileLogoText: { fontSize: '16px', fontWeight: 600, color: '#eee5cf' },
  title: { fontSize: '24px', fontWeight: 700, color: '#eee5cf', margin: '0 0 6px' },
  sub: { fontSize: '14px', color: '#4a6070', margin: '0 0 24px', lineHeight: 1.6 },
  oauthBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '11px 16px', background: '#0f1820', border: '1px solid #1e2e3e', borderRadius: '10px', color: '#c8d8e0', fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'border-color .15s' },
  divider: { display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' },
  dividerLine: { flex: 1, height: '1px', background: '#141e28' },
  dividerLabel: { fontSize: '12px', color: '#2a3a48', flexShrink: 0 },
  errorBox: { background: '#1a0d0d', border: '1px solid #3a1818', color: '#e08070', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', lineHeight: 1.5 },
  successBox: { background: '#0d1a0d', border: '1px solid #1a3a1a', color: '#6abf6a', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', lineHeight: 1.5 },
  label: { display: 'block', fontSize: '12px', fontWeight: 500, color: '#4a6070', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 13px', background: '#0c1520', border: '1px solid #1a2a38', borderRadius: '8px', color: '#d0e0e8', fontSize: '14px', outline: 'none', marginBottom: '2px', boxSizing: 'border-box', transition: 'border-color .15s' },
  passwordWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#3a5060', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' },
  forgotRow: { display: 'flex', justifyContent: 'flex-end', margin: '8px 0 20px' },
  forgotLink: { fontSize: '12px', color: '#3a6070', textDecoration: 'none' },
  submitBtn: { width: '100%', padding: '12px', background: '#d4a847', color: '#080e14', fontSize: '14px', fontWeight: 700, border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.2px' },
  switchText: { fontSize: '13px', color: '#3a5060', textAlign: 'center', marginTop: '24px' },
  switchLink: { color: '#d4a847', textDecoration: 'none', fontWeight: 500 },
  // OTP styles
  otpIconWrap: { marginBottom: '20px' },
  otpRow: { display: 'flex', gap: '10px', marginBottom: '24px', justifyContent: 'center' },
  otpInput: { width: '46px', height: '54px', background: '#0c1520', border: '1.5px solid #1a2a38', borderRadius: '10px', color: '#d0e0e8', fontSize: '22px', fontWeight: 700, textAlign: 'center', outline: 'none', transition: 'border-color .15s', boxSizing: 'border-box' },
  resendRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' },
  resendText: { fontSize: '13px', color: '#3a5060' },
  resendBtn: { fontSize: '13px', color: '#d4a847', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, padding: 0 },
  backBtn: { display: 'block', width: '100%', marginTop: '16px', background: 'none', border: 'none', color: '#4a6070', fontSize: '13px', cursor: 'pointer', textAlign: 'center' },
};