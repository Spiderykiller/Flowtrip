import { motion } from "framer-motion";

const PROMPTS = [
  "5 days in Japan, April, budget $2000, love street food & temples",
  "Romantic week in Europe under $3000, no tourist traps",
  "Solo backpacking Southeast Asia for 2 weeks on a budget",
  "Family trip to Costa Rica, 10 days, kids ages 8 and 12",
  "Best time to visit Patagonia and must-see trails",
  "Weekend getaway from NYC, nature & hiking, any season",
];

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export default function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {PROMPTS.map((prompt, i) => (
        <motion.button
          key={prompt}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.05 }}
          onClick={() => onSelect(prompt)}
          className="text-sm px-4 py-2 rounded-full border border-border bg-white hover:border-primary hover:text-primary hover:bg-primary/5 transition-all text-muted-foreground"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
}