import { motion } from "framer-motion";
import { MapPin, Thermometer, Star } from "lucide-react";
import { useState } from "react";

interface Destination {
  image: string;
  alt: string;
  aiScore: string | number;
  coordinates: string;
  name: string;
  region: string;
  temp: string;
  description: string;
  tags: string[];
}

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

export default function DestinationCard({ destination, index }: DestinationCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] as const }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex-shrink-0 w-[340px] md:w-[400px] lg:w-[460px] h-[520px] md:h-[580px] rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <motion.img
        src={destination.image}
        alt={destination.alt}
        className="absolute inset-0 w-full h-full object-cover"
        animate={{ scale: isHovered ? 1.05 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* AI Score Badge */}
      <div className="absolute top-5 right-5 bg-white/10 backdrop-blur-xl text-white rounded-full px-3 py-1.5 text-xs font-mono border border-white/10 flex items-center gap-1.5">
        <Star className="w-3 h-3 text-accent fill-accent" />
        {destination.aiScore}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-7">
        {/* Coordinates */}
        <div className="font-mono text-[11px] text-white/50 tracking-widest mb-2">
          {destination.coordinates}
        </div>

        <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">
          {destination.name}
        </h3>

        <div className="flex items-center gap-3 text-white/70 text-sm mb-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {destination.region}
          </span>
          <span className="flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5" />
            {destination.temp}
          </span>
        </div>

        {/* Expanded DNA — revealed on hover */}
        <motion.div
          initial={false}
          animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <p className="text-sm text-white/70 leading-relaxed mb-4">
            {destination.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {destination.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-white/10 backdrop-blur-sm text-white/80 px-3 py-1 rounded-full border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}