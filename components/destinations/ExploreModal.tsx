'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, MapPin, Globe, Loader2, ChevronLeft, ChevronRight, Star } from 'lucide-react';

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

interface ExploreModalProps {
  open: boolean;
  onClose: () => void;
}

const CONTINENTS = [
  { id: 'all',      label: 'All' },
  { id: 'europe',   label: '🇪🇺 Europe' },
  { id: 'asia',     label: '🌏 Asia' },
  { id: 'africa',   label: '🌍 Africa' },
  { id: 'americas', label: '🌎 Americas' },
  { id: 'oceania',  label: '🌊 Oceania' },
];

const CATEGORIES = [
  { id: 'all',       label: '✨ All' },
  { id: 'culture',   label: '🏛️ Culture' },
  { id: 'nature',    label: '🌿 Nature' },
  { id: 'adventure', label: '🧗 Adventure' },
  { id: 'coastal',   label: '🏖️ Coastal' },
  { id: 'luxury',    label: '💎 Luxury' },
];

export default function ExploreModal({ open, onClose }: ExploreModalProps) {
  const [continent, setContinent] = useState('all');
  const [category, setCategory]   = useState('all');
  const [query, setQuery]         = useState('');
  const [page, setPage]           = useState(0);
  const [results, setResults]     = useState<Destination[]>([]);
  const [loading, setLoading]     = useState(false);
  const [hasMore, setHasMore]     = useState(true);
  const [selected, setSelected]   = useState<Destination | null>(null);
  const searchRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const fetchResults = useCallback(async (
    c: string, cat: string, q: string, p: number
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ continent: c, category: cat, q, page: String(p) });
      const res = await fetch(`/api/destinations?${params}`);
      const data: Destination[] = res.ok ? await res.json() : [];
      if (p === 0) {
        setResults(data);
      } else {
        setResults(prev => [...prev, ...data]);
      }
      setHasMore(data.length >= 12);
    } catch {
      if (p === 0) setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset + fetch on filter change
  useEffect(() => {
    if (!open) return;
    setPage(0);
    setResults([]);
    fetchResults(continent, category, query, 0);
  }, [continent, category, open]); // eslint-disable-line

  // Debounced search
  useEffect(() => {
    if (!open) return;
    clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setPage(0);
      fetchResults(continent, category, query, 0);
    }, 400);
    return () => clearTimeout(searchRef.current);
  }, [query]); // eslint-disable-line

  function loadMore() {
    const next = page + 1;
    setPage(next);
    fetchResults(continent, category, query, next);
  }

  // Lock body scroll
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="fixed inset-x-4 top-[5vh] bottom-[3vh] md:inset-x-8 lg:inset-x-16 xl:inset-x-24 bg-background rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
              <div>
                <h2 className="font-display font-bold text-xl text-foreground">Explore Destinations</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Live data from 10M+ global attractions
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-4 space-y-3 border-b border-border flex-shrink-0 bg-muted/20">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search destinations, cities, landmarks…"
                  className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>

              {/* Continent pills */}
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {CONTINENTS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setContinent(c.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      continent === c.id
                        ? 'bg-primary text-white border-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Category pills */}
              <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      category === c.id
                        ? 'bg-foreground text-background border-foreground'
                        : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground bg-background'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Results grid */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loading && results.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-2xl bg-muted animate-pulse h-52" />
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Globe className="w-12 h-12 text-muted-foreground/30 mb-4" strokeWidth={1} />
                  <p className="font-semibold text-foreground mb-1">No destinations found</p>
                  <p className="text-sm text-muted-foreground">Try a different search or filter combination</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.map(dest => (
                      <motion.button
                        key={dest.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelected(dest)}
                        className="group rounded-2xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all text-left"
                      >
                        {/* Image */}
                        <div className="relative h-36 overflow-hidden bg-muted">
                          {dest.image ? (
                            <img
                              src={dest.image}
                              alt={dest.imageAlt}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Globe className="w-8 h-8 text-muted-foreground/30" strokeWidth={1} />
                            </div>
                          )}
                          {/* Score badge */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full">
                            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            {dest.aiScore}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <p className="font-semibold text-sm text-foreground truncate">{dest.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
                            {dest.country}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {dest.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Load more */}
                  {hasMore && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={loadMore}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-border text-sm font-medium rounded-full hover:bg-muted transition-colors text-foreground disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {loading ? 'Loading…' : 'Load more destinations'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Destination detail overlay */}
          <AnimatePresence>
            {selected && (
              <>
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => setSelected(null)}
                  className="fixed inset-0 bg-black/70 z-[60]"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] as const}}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card rounded-3xl shadow-2xl z-[60] overflow-hidden border border-border"
                >
                  {/* Image */}
                  <div className="relative h-56">
                    {selected.image ? (
                      <img src={selected.image} alt={selected.imageAlt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Globe className="w-12 h-12 text-muted-foreground/30" strokeWidth={1} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <button
                      onClick={() => setSelected(null)}
                      className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-black/60 transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    <div className="absolute bottom-4 left-5">
                      <h3 className="font-display font-bold text-2xl text-white">{selected.name}</h3>
                      <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{selected.country}
                      </p>
                    </div>
                    <div className="absolute top-4 left-5 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {selected.aiScore} AI Score
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selected.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {selected.tags.map(tag => (
                        <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-5 py-3 border-y border-border">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3" /> {selected.coordinates}
                      </span>
                      {selected.temp && (
                        <span>🌡️ Avg. {selected.temp}</span>
                      )}
                    </div>

                    <a
                      href={`/AIPlanner?q=${encodeURIComponent(`Plan a trip to ${selected.name}, ${selected.country}`)}`}
                      className="block w-full text-center py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
                    >
                      Plan a trip to {selected.name} →
                    </a>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}