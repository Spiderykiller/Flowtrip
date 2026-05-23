'use client';

import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

const COOKIE_TYPES = [
  {
    name: 'base44_session',
    type: 'Strictly necessary',
    purpose: 'Maintains your login session. Without this cookie, you would be logged out on every page load.',
    duration: 'Session / 7 days',
    canDisable: false,
  },
  {
    name: 'theme_preference',
    type: 'Functional',
    purpose: 'Remembers your light/dark mode preference across visits.',
    duration: '1 year',
    canDisable: true,
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const},
});

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 md:px-10 lg:px-16 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Cookie className="w-4 h-4" />
            Legal
          </motion.div>
          <motion.h1 {...fade(0.1)} className="font-display font-bold text-5xl md:text-6xl leading-tight text-foreground mb-4">
            Cookie Policy
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">January 1, 2025</span>
          </motion.p>
          <motion.p {...fade(0.25)} className="text-muted-foreground mt-3 leading-relaxed max-w-xl">
            FlowTrip uses a minimal number of cookies. This page explains exactly what we set, why, and how long it lasts.
          </motion.p>
        </div>
      </section>

      {/* ── What are cookies ── */}
      <section className="py-16 px-6 md:px-10 lg:px-16 border-b border-border">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.h2 {...fade(0)} className="font-display font-semibold text-2xl text-foreground">What are cookies?</motion.h2>
          <motion.p {...fade(0.1)} className="text-sm text-muted-foreground leading-relaxed">
            Cookies are small text files stored in your browser when you visit a website. They let the site remember information about your visit — like whether you're logged in — so you don't have to re-enter it every time.
          </motion.p>
          <motion.p {...fade(0.15)} className="text-sm text-muted-foreground leading-relaxed">
            FlowTrip uses as few cookies as possible. We do not use advertising cookies, tracking cookies, or third-party analytics cookies by default.
          </motion.p>
        </div>
      </section>

      {/* ── Cookie table ── */}
      <section className="py-16 px-6 md:px-10 lg:px-16 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fade(0)} className="font-display font-semibold text-2xl text-foreground mb-8">Cookies we use</motion.h2>

          <div className="space-y-4">
            {COOKIE_TYPES.map((cookie, i) => (
              <motion.div key={cookie.name} {...fade(i * 0.1)} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <code className="text-sm font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">{cookie.name}</code>
                    <span className="ml-2 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{cookie.type}</span>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
                    cookie.canDisable
                      ? 'bg-muted text-muted-foreground'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {cookie.canDisable ? 'Optional' : 'Required'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{cookie.purpose}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Duration:</span> {cookie.duration}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Managing cookies ── */}
      <section className="py-16 px-6 md:px-10 lg:px-16 border-b border-border">
        <div className="max-w-3xl mx-auto space-y-6">
          <motion.h2 {...fade(0)} className="font-display font-semibold text-2xl text-foreground">Managing cookies</motion.h2>
          <motion.p {...fade(0.1)} className="text-sm text-muted-foreground leading-relaxed">
            You can control cookies through your browser settings. Most browsers allow you to refuse cookies, delete existing cookies, or be notified when a cookie is set. Note that disabling the <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">base44_session</code> cookie will log you out.
          </motion.p>
          <motion.p {...fade(0.15)} className="text-sm text-muted-foreground leading-relaxed">
            Browser cookie management guides:{' '}
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chrome</a>
            {', '}
            <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firefox</a>
            {', '}
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Safari</a>
          </motion.p>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-16 px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fade(0)} className="font-display font-semibold text-2xl text-foreground mb-4">Questions?</motion.h2>
          <motion.p {...fade(0.1)} className="text-sm text-muted-foreground leading-relaxed">
            If you have questions about our use of cookies, email us at{' '}
            <a href="mailto:privacy@flowtrip.com" className="text-primary hover:underline">privacy@flowtrip.com</a>.
          </motion.p>
        </div>
      </section>

    </div>
  );
}