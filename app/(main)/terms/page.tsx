'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const SECTIONS = [
  {
    title: '1. Acceptance of terms',
    body: [
      'By accessing or using FlowTrip, you agree to be bound by these Terms of Service and our Privacy Policy.',
      'If you do not agree to these terms, you may not use the service.',
      'We may update these terms at any time. Continued use of the service after changes constitutes acceptance.',
    ],
  },
  {
    title: '2. Use of the service',
    body: [
      'You must be at least 16 years old to use FlowTrip.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You agree not to misuse the service — including attempting to reverse-engineer, scrape, or abuse our AI systems.',
      'You may not use FlowTrip for any unlawful purpose or in any way that could harm other users.',
    ],
  },
  {
    title: '3. AI-generated content',
    body: [
      'FlowTrip\'s AI generates travel itineraries based on your inputs. These are suggestions, not professional advice.',
      'Prices, availability, hours, and other specifics may change. Always verify details before booking.',
      'We are not responsible for inaccuracies in AI-generated content. Use it as a starting point, not a guarantee.',
      'You retain ownership of the content you provide as inputs. We retain rights to anonymized data for model improvement.',
    ],
  },
  {
    title: '4. Saved trips and data',
    body: [
      'Trips you save are stored in our database and associated with your account.',
      'You can delete your saved trips at any time from the Saved Trips page.',
      'We back up data regularly but do not guarantee against data loss in exceptional circumstances.',
    ],
  },
  {
    title: '5. Intellectual property',
    body: [
      'The FlowTrip name, logo, design, and underlying technology are owned by FlowTrip and protected by intellectual property laws.',
      'You may not reproduce, distribute, or create derivative works from our platform without explicit written permission.',
      'User-submitted content (trip notes, preferences) remains yours. You grant us a limited license to process it to provide the service.',
    ],
  },
  {
    title: '6. Disclaimers and limitation of liability',
    body: [
      'FlowTrip is provided "as is" without warranties of any kind, express or implied.',
      'We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.',
      'Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.',
      'We are not liable for any travel decisions made based on AI-generated itineraries.',
    ],
  },
  {
    title: '7. Termination',
    body: [
      'You may delete your account at any time from Settings.',
      'We reserve the right to suspend or terminate accounts that violate these terms.',
      'Upon termination, your data will be deleted in accordance with our Privacy Policy.',
    ],
  },
  {
    title: '8. Governing law',
    body: [
      'These terms are governed by the laws of the European Union.',
      'Any disputes will be resolved through binding arbitration before resorting to litigation.',
      'For questions about these terms, contact legal@flowtrip.com.',
    ],
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
});

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-6 md:px-10 lg:px-16 border-b border-border">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <FileText className="w-4 h-4" />
            Legal
          </motion.div>
          <motion.h1 {...fade(0.1)} className="font-display font-bold text-5xl md:text-6xl leading-tight text-foreground mb-4">
            Terms of Service
          </motion.h1>
          <motion.p {...fade(0.2)} className="text-muted-foreground">
            Last updated: <span className="font-medium text-foreground">January 1, 2025</span>
          </motion.p>
          <motion.p {...fade(0.25)} className="text-muted-foreground mt-3 leading-relaxed max-w-xl">
            Please read these terms carefully before using FlowTrip. They govern your use of our platform and AI travel planning service.
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
              These Terms of Service constitute the entire agreement between you and FlowTrip regarding use of the service. If any provision is found unenforceable, the remaining provisions continue in full force.
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}