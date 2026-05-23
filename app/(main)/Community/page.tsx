"use client";

import Link from "next/link";
import { ArrowRight, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import SectionLabel from "@/components/shared/SectionLabel";
import AnimatedSection from "@/components/shared/AnimatedSection";
import TestimonialCard from "@/components/community/TestimonialCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Testimonial {
  name: string;
  destination: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Elena Rossi",
    destination: "Explored Amalfi Coast",
    quote: "AeroVista didn't just plan my trip—it transformed how I experience travel. Every restaurant, every hidden path was perfectly curated. It felt like having a brilliant local friend in every city.",
  },
  {
    name: "James Chen",
    destination: "Explored Kyoto",
    quote: "The AI predicted a local festival I'd never have found on my own. I stumbled into a thousand-lantern ceremony at a shrine tucked behind bamboo groves. Absolutely unforgettable.",
  },
  {
    name: "Amara Okafor",
    destination: "Explored Sahara",
    quote: "From predicting the best dune for sunrise to arranging a Berber camp experience—the level of personalization was extraordinary. Like the app could read my mind.",
  },
  {
    name: "Lucas Weber",
    destination: "Explored Swiss Alps",
    quote: "The predictive pricing alone saved me €800 on my Alpine lodge. But it was the curated hiking routes with real-time weather adjustments that truly blew my mind.",
  },
  {
    name: "Sofia Park",
    destination: "Explored Bali",
    quote: "I travel solo often and safety is everything. The real-time safety insights and offline emergency info gave me the confidence to explore places I never would have on my own.",
  },
  {
    name: "Marco Silva",
    destination: "Explored Patagonia",
    quote: "Patagonia's weather is brutal and unpredictable. AeroVista rerouted my trek twice in real-time to avoid storms, and both detours led to even more spectacular views.",
  },
];

export default function Community() {
  const [email, setEmail] = useState<string>("");

  return (
    <div className="pt-24 md:pt-32">

      {/* Testimonials — Postcards from the Field */}
      <section className="pb-20 md:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
          <AnimatedSection>
            <SectionLabel label="Postcards from the Field" />
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight mt-4 mb-6">
              Traveler Stories
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mb-16">
              Real experiences from real explorers. Discover how AeroVista transformed their journeys.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Departure Lounge */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-foreground" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />

        <div className="relative max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 py-24 md:py-32 lg:py-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white/80 rounded-full px-4 py-2 text-sm mb-8 border border-white/10 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Departure Lounge
            </div>

            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight mb-6 leading-tight">
              Ready to See the World
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Differently?
              </span>
            </h2>

            <p className="text-white/60 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
              Join 50,000+ travelers who&apos;ve discovered a smarter way to explore with FlowTrip. Your next adventure is one click away.
            </p>

            {/* Email signup */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-full px-6 text-base focus-visible:ring-primary"
              />
              <Button
                className="h-14 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                Get Started
              </Button>
            </div>

            <p className="text-xs text-white/40 font-mono">
              Free to join · No credit card required · Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}