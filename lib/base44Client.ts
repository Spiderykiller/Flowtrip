/**
 * src/lib/base44Client.ts
 *
 * Base44 SDK singleton.
 * Only used client-side for OAuth redirect:
 *   base44.auth.redirectToLogin(callbackUrl)
 *   base44.auth.loginWithProvider('google', callbackUrl)
 *
 * All other auth calls (login, signup, me) go through
 * server-side API routes in app/api/auth/.
 */

import { createClient } from '@base44/sdk';

export const base44 = createClient({
  appId: process.env.NEXT_PUBLIC_BASE44_APP_ID ?? '',
});