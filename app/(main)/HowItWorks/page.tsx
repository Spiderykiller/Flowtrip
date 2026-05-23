"use client";


import SectionLabel from "@/components/shared/SectionLabel";
import AnimatedSection from "@/components/shared/AnimatedSection";
import StepCard from "@/components/how-it-works/StepCard";
import FeatureGrid from "@/components/how-it-works/FeatureGrid";
import AIHud from "@/components/how-it-works/AIHud";

const STEPS = [
  {
    title: "Tell Us Your Dream",
    description: "Share your travel preferences, dates, and interests. Our AI begins mapping millions of possibilities the moment you start.",
  },
  {
    title: "AI Analyzes & Curates",
    description: "Our engine cross-references weather patterns, local events, pricing trends, and safety data to build your perfect itinerary.",
  },
  {
    title: "Personalized Itinerary",
    description: "Receive a detailed, day-by-day plan tailored to your style—from hidden restaurants to optimal sightseeing routes.",
  },
  {
    title: "Travel with Confidence",
    description: "Real-time updates, local insights, and 24/7 AI support accompany you throughout your journey.",
  },
];

export default function HowItWorks() {
  return (
    <div className="pt-24 md:pt-32 pb-20 md:pb-32">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">

        {/* Section 1: How It Works Steps */}
        <AnimatedSection>
          <SectionLabel label="Intelligence Engine" />
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight mt-4 mb-6">
            How It Works
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mb-16">
            Four steps from dream to departure. Our AI handles the complexity so you can focus on the experience.
          </p>
        </AnimatedSection>

        <div className="max-w-2xl mb-28 md:mb-36">
          {STEPS.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>

        {/* Section 2: Features */}
        <AnimatedSection>
          <SectionLabel label="Capabilities" />
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mt-4 mb-4">
            Built for Modern Explorers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-12">
            Every feature is engineered with precision to make your journey seamless, safe, and unforgettable.
          </p>
        </AnimatedSection>

        <div className="mb-28 md:mb-36">
          <FeatureGrid />
        </div>

        {/* Section 3: AI Engine HUD */}
        <AnimatedSection>
          <SectionLabel label="AI Core" />
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground tracking-tight mt-4 mb-4">
            The Intelligence Behind Your Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mb-10">
            Our AI engine processes real-time data from across the globe, turning complexity into clarity.
          </p>
        </AnimatedSection>

        <AIHud />
      </div>
    </div>
  );
}
