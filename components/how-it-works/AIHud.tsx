import { motion } from "framer-motion";
import { Cpu, Activity, Database, Sparkles, LucideIcon } from "lucide-react";

interface HudItem {
  label: string;
  value: string;
  icon: LucideIcon;
}

const HUD_ITEMS: HudItem[] = [
  { label: "Data Points Analyzed", value: "2.4M+", icon: Database },
  { label: "AI Model Accuracy", value: "99.2%", icon: Cpu },
  { label: "Response Time", value: "< 200ms", icon: Activity },
  { label: "Personalization Score", value: "97.8%", icon: Sparkles },
];

export default function AIHud() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-foreground/[0.03] backdrop-blur-sm border border-border rounded-3xl" />

      {/* HUD Grid */}
      <div className="relative p-8 md:p-10">
        {/* HUD Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest uppercase">
            AI Engine — Live
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {HUD_ITEMS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
              className="p-5 rounded-2xl bg-card/80 backdrop-blur-sm border border-border"
            >
              <item.icon className="w-5 h-5 text-primary mb-3" strokeWidth={1.5} />
              <div className="font-display font-bold text-2xl md:text-3xl text-foreground">
                {item.value}
              </div>
              <div className="font-mono text-[11px] text-muted-foreground mt-1 tracking-wide uppercase">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Simulated data stream */}
        <div className="mt-8 p-4 rounded-xl bg-foreground/[0.02] border border-border font-mono text-xs text-muted-foreground space-y-1.5 overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-green-500">▸</span>
            <span>Processing destination matrix... <span className="text-primary">complete</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">▸</span>
            <span>Weather pattern analysis (7-day forecast)... <span className="text-primary">synced</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">▸</span>
            <span>Cultural event correlation... <span className="text-primary">14 matches found</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-accent">▸</span>
            <span>Optimizing itinerary pathways... <span className="text-accent">in progress</span></span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}