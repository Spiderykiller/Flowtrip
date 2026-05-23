import { motion } from "framer-motion";

interface SectionLabelProps {
  label: string;
  className?: string;
}

export default function SectionLabel({ label, className = "" }: SectionLabelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2 ${className}`}
    >
      <span className="w-8 h-px bg-primary" />
      <span className="font-mono text-xs tracking-widest uppercase text-primary font-medium">
        {label}
      </span>
    </motion.div>
  );
}