'use client';

import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Information we collect',
    body: [
      'Account information: When you create an account, we collect your name and email address. This is managed through Base44 authentication.',
      'Usage data: We collect information about how you use FlowTrip, including pages visited, features used, and AI prompts submitted (to improve our models — never sold).',
      'Trip data: Itineraries you save, preferences you set, and trip history are stored to personalize your experience.',
      'Device information: Browser type, operating system, and IP address for security and performance purposes.',
    ],
  },
  {
    title: '2. How we use your information',
    body: [
      'To provide and improve the FlowTrip service, including personalized itinerary suggestions.',
      'To communicate with you about your account, updates, or support requests.',
      'To analyze usage patterns and improve our AI models and product experience.',
      'To comply with legal obligations and enforce our Terms of Service.',
    ],
  },
  {
    title: '3. Data sharing',
    body: [
      'We do not sell your personal data to third parties. Ever.',
      'We share data with service providers (NeonDB for storage, Base44 for auth, Google/Groq for AI) under strict data processing agreements.',
      'We may disclose data if required by law or to protect the rights and safety of our users.',
    ],
  },
  {
    title: '4. Data retention',
    body: [
      'Account data is retained while your account is active. You can delete your account at any time from Settings.',
      'Saved trips and preferences are deleted within 30 days of account deletion.',
      'Anonymized usage analytics may be retained indefinitely for product improvement.',
    ],
  },
  {
    title: '5. Your rights',
    body: [
      'Access: You can view all data we hold about you by contacting privacy@flowtrip.com.',
      'Deletion: You can delete your account and all associated data from the Settings page.',
      'Portability: You can export your saved trips and preferences at any time.',
      'Correction: You can update your profile information from the Settings or Profile pages.',
    ],
  },
  {
    title: '6. Cookies',
    body: [
      'We use a session cookie (`base44_session`) to maintain your login state. This is strictly necessary and cannot be disabled while logged in.',
      'We do not use advertising or tracking cookies.',
      'Analytics cookies, if used, are anonymized and governed by our Cookie Policy.',
    ],
  },
  {
    title: '7. Security',
    body: [
      'All data is transmitted over HTTPS with TLS 1.3.',
      'Passwords are never stored by FlowTrip — authentication is handled by Base44.',
      'Database access is restricted to authorized personnel and services only.',
    ],
  },
  {
    title: '8. Contact',
    body: [
      'For privacy-related questions or requests, contact us at privacy@flowtrip.com. We respond within 5 business days.',
    ],
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 md:px-10 lg:px-16 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Shield className="w-4 h-4" />
            Legal
          </motion.div>
          <motion.h1 {...fade(0.1)} className="font-display font-bold text-5xl md:text-6xl leading-tight text-foreground mb-4">
            Privacy Policy
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">January 1, 2025</span>
          </motion.p>
          <motion.p {...fade(0.25)} className="text-muted-foreground mt-3 leading-relaxed max-w-xl">
            FlowTrip (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy explains what data we collect, why, and how you control it.
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="py-16 px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {SECTIONS.map((section, i) => (
            <motion.div key={section.title} {...fade(i * 0.05)} >
              <h2 className="font-display font-semibold text-xl text-foreground mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.body.map((item, j) => (
                  <li key={j} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div {...fade(0.5)} className="pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              This Privacy Policy is governed by the laws of the European Union (GDPR) and applies to all users globally. By using FlowTrip, you agree to the collection and use of information as described here.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}