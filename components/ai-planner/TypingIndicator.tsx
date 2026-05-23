import { motion } from "framer-motion";
import { Plane } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex gap-3 items-start"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
        <Plane className="w-4 h-4 text-white" strokeWidth={2} />
      </div>
      <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/40"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.7, delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}