import { motion } from "framer-motion";
import {
  Shield, Zap, Globe, BarChart3, Wifi, Lock, LucideIcon
} from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Real-Time Analysis",
    desc: "Live data streams from weather, events, and travel networks processed in milliseconds.",
  },
  {
    icon: Globe,
    title: "Global Coverage",
    desc: "150+ destinations across 6 continents, each with deep cultural and logistical intelligence.",
  },
  {
    icon: BarChart3,
    title: "Predictive Pricing",
    desc: "AI models forecast optimal booking windows to save you up to 40% on every trip.",
  },
  {
    icon: Shield,
    title: "Safety Intelligence",
    desc: "Continuous safety monitoring with real-time alerts and risk assessments for every destination.",
  },
  {
    icon: Wifi,
    title: "Offline Access",
    desc: "Download your itinerary with maps, translations, and emergency info for offline use.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    desc: "Your travel data is encrypted end-to-end. We never sell or share your personal information.",
  },
];

export default function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {FEATURES.map((feat, i) => (
        <motion.div
          key={feat.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const}}
          className="group p-7 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
            <feat.icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
          </div>
          <h3 className="font-display font-semibold text-foreground mb-2">{feat.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}