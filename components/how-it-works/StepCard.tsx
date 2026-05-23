import { motion } from "framer-motion";

interface Step {
  title: string;
  description: string;
}

interface StepCardProps {
  step: Step;
  index: number;
}

export default function StepCard({ step, index }: StepCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-12 md:pl-16 pb-12 last:pb-0"
    >
      {/* Vertical line */}
      {index < 3 && (
        <div className="absolute left-[18px] md:left-[22px] top-10 bottom-0 w-px bg-border" />
      )}

      {/* Step number */}
      <div className="absolute left-0 md:left-1 top-0 w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary text-primary-foreground font-display font-bold text-sm md:text-base flex items-center justify-center">
        {String(index + 1).padStart(2, "0")}
      </div>

      <div className="pt-0.5">
        <h3 className="font-display font-semibold text-xl md:text-2xl text-foreground mb-2">
          {step.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed max-w-lg">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}