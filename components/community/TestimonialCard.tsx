import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  destination: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

export default function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div className="p-8 md:p-10 rounded-3xl border border-border bg-card hover:border-primary/20 transition-all duration-300">
        {/* Quote icon */}
        <Quote className="w-8 h-8 text-primary/20 mb-5" strokeWidth={1.5} />

        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 text-accent fill-accent"
              strokeWidth={0}
            />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-foreground text-lg leading-relaxed mb-8 font-body">
          &quot;{testimonial.quote}&quot;
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
            {testimonial.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <div className="font-display font-semibold text-foreground">{testimonial.name}</div>
            <div className="text-sm text-muted-foreground">{testimonial.destination}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}