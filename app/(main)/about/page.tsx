'use client';

import { motion } from 'framer-motion';
import { Plane, Globe, Zap, Heart, Users, MapPin } from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { value: '50K+', label: 'Trips planned' },
  { value: '120+', label: 'Countries covered' },
  { value: '4.9★', label: 'Average rating' },
  { value: '2 min', label: 'Avg. plan time' },
];

const VALUES = [
  {
    icon: Globe,
    title: 'Travel for everyone',
    body: 'Whether you have $500 or $50,000, FlowTrip builds itineraries that respect your reality — not a fantasy version of it.',
  },
  {
    icon: Zap,
    title: 'Intelligence over automation',
    body: 'We don\'t scrape review sites and stitch them together. Our AI reasons about your trip the way an expert friend would.',
  },
  {
    icon: Heart,
    title: 'Authenticity first',
    body: 'We filter out tourist traps by default. Every recommendation is weighted toward local, memorable, and genuine.',
  },
  {
    icon: Users,
    title: 'Built with travelers',
    body: 'Every feature ships because a real traveler asked for it. Our community shapes the roadmap, not the other way around.',
  },
];

const TEAM = [
  { name: 'Aria Solano', role: 'Co-founder & CEO', location: 'Lisbon, PT', initials: 'AS' },
  { name: 'Dev Rajan', role: 'Co-founder & CTO', location: 'Berlin, DE', initials: 'DR' },
  { name: 'Mika Chen', role: 'Head of AI', location: 'Tokyo, JP', initials: 'MC' },
  { name: 'Ines Bouali', role: 'Head of Design', location: 'Paris, FR', initials: 'IB' },
];

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
});

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 md:px-10 lg:px-16 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div {...fade(0)} className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-8">
            <Plane className="w-4 h-4" strokeWidth={2} />
            Our story
          </motion.div>

          <motion.h1 {...fade(0.1)} className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground mb-6">
            We believe the best trips{' '}
            <span className="text-primary">start with a conversation</span>
          </motion.h1>

          <motion.p {...fade(0.2)} className="text-muted-foreground text-xl leading-relaxed max-w-2xl mx-auto">
            FlowTrip was born out of frustration with travel planning — endless tabs, contradictory advice, and itineraries built for someone else. We set out to build something that actually thinks with you.
          </motion.p>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 md:px-10 lg:px-16 border-y border-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fade(i * 0.08)} className="text-center">
              <p className="font-display font-bold text-4xl text-foreground mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div {...fade(0)}>
            <h2 className="font-display font-bold text-4xl text-foreground mb-6 leading-tight">
              The travel planner that finally gets you
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Most travel tools are directories. You still have to do the thinking. FlowTrip is different — it starts from your context (budget, pace, travel style, group size) and reasons outward to build something genuinely yours.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We combine frontier AI with a deep knowledge base of real traveler experiences, local expertise, and up-to-date logistics — so every plan is both inspired and practical.
            </p>
            <Link
              href="/AIPlanner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Try the planner →
            </Link>
          </motion.div>

          {/* Visual accent */}
          <motion.div {...fade(0.15)} className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/10 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3 p-8">
                {['🗼', '🏔️', '🌊', '🏜️', '🌸', '🏛️', '🌴', '🗺️', '✈️'].map((emoji, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center text-2xl shadow-sm"
                  >
                    {emoji}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16 bg-muted/30 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade(0)} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">What we stand for</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Four principles that guide every decision we make.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} {...fade(i * 0.1)} className="bg-card border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fade(0)} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-foreground mb-4">The team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A small team of obsessive travelers, engineers, and designers — spread across four continents.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} {...fade(i * 0.08)} className="text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                  {member.initials}
                </div>
                <p className="font-semibold text-sm text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
                <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />{member.location}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 md:px-10 lg:px-16 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2 {...fade(0)} className="font-display font-bold text-4xl text-foreground mb-4">
            Ready to plan your next trip?
          </motion.h2>
          <motion.p {...fade(0.1)} className="text-muted-foreground mb-8">
            Join thousands of travelers already using FlowTrip to plan smarter, faster, and better.
          </motion.p>
          <motion.div {...fade(0.2)} className="flex items-center justify-center gap-3">
            <Link href="/AIPlanner" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors">
              Start planning free →
            </Link>
            <Link href="/HowItWorks" className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-medium rounded-full hover:bg-muted transition-colors text-foreground">
              How it works
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  );
}