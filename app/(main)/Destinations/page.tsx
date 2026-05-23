"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Globe, Star, MapPin, Compass } from "lucide-react";
import SectionLabel from "@/components/shared/SectionLabel";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ExploreModal from "@/components/destinations/ExploreModal";

interface Destination {
  id: string;
  name: string;
  region: string;
  country: string;
  coordinates: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  aiScore: string;
  temp?: string;
}

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[340px] md:w-[380px] h-[480px] rounded-3xl bg-muted animate-pulse snap-start" />
  );
}

// ── Destination Card ──────────────────────────────────────────────────────────

function DestinationCard({ destination, index }: { destination: Destination; index: number }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className="relative flex-shrink-0 w-[340px] md:w-[380px] h-[480px] rounded-3xl overflow-hidden cursor-pointer snap-start group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        {destination.image && !imgError ? (
          <img
            src={destination.image}
            alt={destination.imageAlt}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-muted flex items-center justify-center">
            <Globe className="w-20 h-20 text-primary/20" strokeWidth={1} />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      </div>

      {/* AI Score badge */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1.5 rounded-full border border-white/10">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        {destination.aiScore}
      </div>

      {/* Tags */}
      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
        {destination.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-medium bg-white/15 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/10"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-3 h-3 text-white/60" />
          <p className="text-white/60 text-xs font-medium tracking-wide uppercase">
            {destination.country}
          </p>
          {destination.temp && (
            <>
              <span className="text-white/30">·</span>
              <span className="text-white/60 text-xs">{destination.temp}</span>
            </>
          )}
        </div>

        {/* Name */}
        <h3 className="font-display font-bold text-3xl text-white mb-2 leading-tight">
          {destination.name}
        </h3>

        {/* Description — slides up on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.p
              initial={{ opacity: 0, y: 10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 10, height: 0 }}
              transition={{ duration: 0.25 }}
              className="text-white/75 text-sm leading-relaxed mb-4 line-clamp-3"
            >
              {destination.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Coordinates */}
        <p className="font-mono text-[11px] text-white/40">{destination.coordinates}</p>

        {/* CTA — appears on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.a
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              href={`/AIPlanner?q=${encodeURIComponent(`Plan a trip to ${destination.name}, ${destination.country}`)}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-white text-foreground text-sm font-semibold rounded-2xl hover:bg-white/90 transition-colors"
              onClick={e => e.stopPropagation()}
            >
              Plan this trip →
            </motion.a>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Destinations() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [exploreOpen, setExploreOpen] = useState(false);

  useEffect(() => {
    fetch('/api/destinations?featured=true')
      .then(r => r.ok ? r.json() : [])
      .then(data => setDestinations(Array.isArray(data) ? data : []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -400 : 400, behavior: "smooth" });
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 md:pb-32">

      {/* Header */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 mb-12">
        <AnimatedSection>
          <SectionLabel label="World Atlas" />
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-4">
            <div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground tracking-tight">
                Destinations
              </h1>
              <p className="text-muted-foreground text-lg mt-3 max-w-xl">
                Curated by AI from millions of real traveler experiences. Hover any card to explore and plan.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Explore more button */}
              <button
                onClick={() => setExploreOpen(true)}
                className="inline-flex items-center gap-2 h-12 px-5 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
              >
                <Compass className="w-4 h-4" />
                Explore more
              </button>

              {/* Scroll controls */}
              <button
                onClick={() => scroll("left")}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-12 h-12 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto px-6 md:px-10 lg:px-16 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : destinations.map((dest, i) => (
              <DestinationCard key={dest.id} destination={dest} index={i} />
            ))
        }
      </div>

      {/* Coordinates strip */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16 mt-16">
        <AnimatedSection>
          <div className="border-t border-border pt-8">
            <div className="flex flex-wrap gap-x-10 gap-y-4">
              {(loading ? [] : destinations).map((dest) => (
                <div key={dest.id} className="font-mono text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">{dest.name}</span>
                  {" · "}
                  {dest.coordinates}
                </div>
              ))}
              {loading && (
                <div className="h-4 w-64 bg-muted animate-pulse rounded" />
              )}
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Explore modal */}
      <ExploreModal open={exploreOpen} onClose={() => setExploreOpen(false)} />
    </div>
  );
}