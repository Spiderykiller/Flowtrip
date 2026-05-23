/**
 * src/lib/app-params.ts
 *
 * Environment variable access — matches your actual .env.local.
 * Only NEXT_PUBLIC_* vars are safe to use in client components.
 */

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${name}`);
    }
    console.warn(`[app-params] Missing env var: ${name}`);
    return '';
  }
  return val;
}

/** Safe for use in client + server components */
export const appParams = {
  /** Your Base44 app ID — from .env.local */
  appId: requireEnv('NEXT_PUBLIC_BASE44_APP_ID'),

  /** Base URL of this Next.js app — http://localhost:3000 in dev */
  appBaseUrl: requireEnv('NEXT_PUBLIC_APP_BASE_URL'),
} as const;