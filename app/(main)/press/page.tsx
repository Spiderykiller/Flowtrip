'use client';

import { motion } from 'framer-motion';
import { Plane, Download, ArrowUpRight } from 'lucide-react';

const COVERAGE = [
  { outlet: 'TechCrunch', headline: 'FlowTrip\'s AI planner is the travel app frequent flyers have been waiting for', date: 'Mar 2025' },
  { outlet: 'The Verge', headline: 'I let an AI plan my entire vacation — here\'s what happened', date: 'Feb 2025' },
  { outlet: 'Condé Nast Traveler', headline: '10 AI tools changing how we travel in 2025', date: 'Jan 2025' },
  { outlet: 'Wired', headline: 'The next generation of travel planning doesn\'t involve search engines', date: 'Dec 2024' },
];

const ASSETS = [
  { label: 'Logo pack (SVG + PNG)', size: '2.4 MB' },
  { label: 'Product screenshots', size: '8.1 MB' },
  { label: 'Brand guidelines PDF', size: '1.2 MB' },
  { label: 'Founder headshots', size: '5.7 MB' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const},
});

export default function PressPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Plane className="w-4 h-4" strokeWidth={2} />
            Press & media
          </motion.div>

          <motion.h1 {...fade(0.1)} className="font-display font-bold text-5xl md:text-6xl leading-[1.05] tracking-tight text-foreground mb-6">
            FlowTrip in the news
          </motion.h1>

          <motion.p {...fade(0.2)} className="text-muted-foreground text-xl leading-relaxed mb-6">
            For press enquiries, interviews, or media assets, reach us at{' '}
            <a href="mailto:press@flowtrip.com" className="text-primary hover:underline">press@flowtrip.com</a>
          </motion.p>

          <motion.div {...fade(0.3)} className="inline-flex items-center gap-3 p-4 bg-card border border-border rounded-2xl">
            <div>
              <p className="text-sm font-semibold text-foreground">Press contact</p>
              <p className="text-xs text-muted-foreground">We typically respond within 4 hours on weekdays</p>
            </div>
            <a
              href="mailto:press@flowtrip.com"
              className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Email us <ArrowUpRight className="w-3 h-3" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Coverage ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fade(0)} className="font-display font-bold text-3xl text-foreground mb-10">Recent coverage</motion.h2>

          <div className="space-y-4">
            {COVERAGE.map((item, i) => (
              <motion.div
                key={item.headline}
                {...fade(i * 0.08)}
                className="group flex items-start justify-between gap-6 p-5 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
              >
                <div>
                  <p className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{item.outlet}</p>
                  <p className="text-sm font-medium text-foreground leading-relaxed group-hover:text-primary transition-colors">{item.headline}</p>
                  <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Assets ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16 border-t border-border bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="mb-10">
            <h2 className="font-display font-bold text-3xl text-foreground mb-3">Media assets</h2>
            <p className="text-muted-foreground">Official logos, screenshots, and brand guidelines for press use.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ASSETS.map((asset, i) => (
              <motion.button
                key={asset.label}
                {...fade(i * 0.08)}
                className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all group text-left"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">{asset.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{asset.size}</p>
                </div>
                <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Boilerplate ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16 border-t border-border">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fade(0)} className="font-display font-bold text-3xl text-foreground mb-6">About FlowTrip</motion.h2>
          <motion.p {...fade(0.1)} className="text-muted-foreground leading-relaxed text-base">
            FlowTrip is an AI-powered travel planning platform that helps travelers create personalized itineraries in minutes. Using frontier language models, FlowTrip understands natural language travel requests — including budget, travel style, duration, and preferences — and produces detailed, actionable plans. FlowTrip supports Gemini and Groq-powered models, and is used by over 50,000 travelers in 120+ countries.
          </motion.p>
        </div>
      </section>

    </div>
  );
}