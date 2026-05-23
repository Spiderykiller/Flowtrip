'use client';

import { motion } from 'framer-motion';
import { Plane, MapPin, ArrowUpRight, Zap, Globe, Heart } from 'lucide-react';
import Link from 'next/link';

const PERKS = [
  { icon: Globe, title: 'Work from anywhere', body: 'Fully remote team across 12 time zones. We care about output, not attendance.' },
  { icon: Plane, title: '$3,000 travel stipend', body: 'Annual budget to go explore. We\'d be embarrassed building a travel product without this.' },
  { icon: Zap, title: 'Top-of-market comp', body: 'Salary + equity. We benchmark against top-tier tech companies and match or beat them.' },
  { icon: Heart, title: 'Async-first culture', body: 'No Slack pings at midnight. Deep work is protected. Meetings are a last resort.' },
];

const ROLES = [
  {
    title: 'Senior Full-Stack Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'AI / ML Engineer',
    team: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    team: 'Design',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Growth Marketer',
    team: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
  },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
});

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Plane className="w-4 h-4" strokeWidth={2} />
            We're hiring
          </motion.div>

          <motion.h1 {...fade(0.1)} className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground mb-6">
            Help us build the future{' '}
            <span className="text-primary">of travel</span>
          </motion.h1>

          <motion.p {...fade(0.2)} className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            FlowTrip is a small, ambitious team building AI that genuinely understands how people want to experience the world. If that excites you, read on.
          </motion.p>

          <motion.a {...fade(0.3)} href="#roles" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors">
            See open roles ↓
          </motion.a>
        </div>
      </section>

      {/* ── Perks ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16 border-y border-border bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade(0)} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">Why FlowTrip</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">We're not a faceless enterprise. We're a team that actually uses the product and cares deeply about the craft.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PERKS.map((p, i) => (
              <motion.div key={p.title} {...fade(i * 0.08)} className="bg-card border border-border rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Open Roles ── */}
      <section id="roles" className="py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fade(0)} className="mb-12">
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">Open roles</h2>
            <p className="text-muted-foreground">All roles are remote-first. We hire globally.</p>
          </motion.div>

          <div className="space-y-3">
            {ROLES.map((role, i) => (
              <motion.div
                key={role.title}
                {...fade(i * 0.08)}
                className="group flex items-center justify-between p-5 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
              >
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{role.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{role.team}</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />{role.location}
                    </span>
                    <span className="text-xs text-muted-foreground">{role.type}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </motion.div>
            ))}
          </div>

          <motion.div {...fade(0.4)} className="mt-12 p-6 bg-muted/50 border border-border rounded-2xl text-center">
            <p className="font-semibold text-foreground mb-2">Don't see your role?</p>
            <p className="text-sm text-muted-foreground mb-4">We're always looking for exceptional people. Send us a note and tell us what you'd build.</p>
            <a
              href="mailto:careers@flowtrip.com"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-sm font-medium rounded-full hover:bg-muted transition-colors text-foreground"
            >
              careers@flowtrip.com →
            </a>
          </motion.div>
        </div>
      </section>

    </div>
  );
}