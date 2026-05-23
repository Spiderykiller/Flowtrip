'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin, Clock, Wallet, Globe, ArrowLeft,
  Trash2, Calendar, Bookmark, Share2, Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  duration_days: string | null;
  budget: string | null;
  cover_image_url: string | null;
  notes: string | null;
  itinerary: { raw: string } | null;
  is_public: boolean;
  created_at: string;
}

export default function TripDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/user/trips/${id}`, { credentials: 'include' })
      .then(r => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.ok ? r.json() : null;
      })
      .then(data => { if (data) setTrip(data); })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    setDeleting(true);
    await fetch(`/api/user/trips/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).catch(() => null);
    router.push('/saved-trips');
  }

  async function handleShare() {
    const url = window.location.href;
    await navigator.clipboard.writeText(url).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const createdDate = trip?.created_at
    ? new Date(trip.created_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      })
    : null;

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10 space-y-6">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-xl" />
          <div className="h-64 bg-muted animate-pulse rounded-3xl" />
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded-lg" style={{ width: `${85 - i * 5}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ────────────────────────────────────────────────────────────────
  if (notFound || !trip) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">Trip not found</h2>
          <p className="text-muted-foreground mb-6">This trip may have been deleted or doesn't exist.</p>
          <Link
            href="/saved-trips"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Saved Trips
          </Link>
        </div>
      </div>
    );
  }

  const itineraryText = trip.itinerary?.raw ?? '';

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-10">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            href="/saved-trips"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Saved Trips
          </Link>
        </motion.div>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          className="bg-card border border-border rounded-3xl overflow-hidden mb-6"
        >
          {/* Cover */}
          <div className="relative h-48 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent">
            {trip.cover_image_url ? (
              <img
                src={trip.cover_image_url}
                alt={trip.destination}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Globe className="w-16 h-16 text-primary/20" strokeWidth={1} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
          </div>

          {/* Info */}
          <div className="px-6 pb-6 -mt-8 relative">
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3 leading-tight">
              {trip.title}
            </h1>

            {/* Meta pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                <MapPin className="w-3 h-3" />
                {trip.destination}
              </span>
              {trip.duration_days && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                  <Clock className="w-3 h-3" />
                  {trip.duration_days} days
                </span>
              )}
              {trip.budget && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                  <Wallet className="w-3 h-3" />
                  {trip.budget}
                </span>
              )}
              {createdDate && (
                <span className="inline-flex items-center gap-1.5 text-xs bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                  <Calendar className="w-3 h-3" />
                  {createdDate}
                </span>
              )}
            </div>

            {/* Notes */}
            {trip.notes && (
              <p className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/30 pl-3">
                {trip.notes}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-5">
              <Link
                href={`/AIPlanner?q=${encodeURIComponent(`Continue planning my trip to ${trip.destination}`)}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
              >
                Continue in AI Planner →
              </Link>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-full hover:bg-muted transition-colors text-foreground"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium rounded-full hover:bg-destructive/5 hover:border-destructive/30 hover:text-destructive transition-colors text-muted-foreground"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Itinerary */}
        {itineraryText ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            className="bg-card border border-border rounded-3xl p-6 md:p-8"
          >
            <h2 className="font-display font-bold text-lg text-foreground mb-6 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" />
              Your Itinerary
            </h2>

            <div className="prose prose-sm max-w-none
              prose-headings:font-display prose-headings:font-semibold prose-headings:text-foreground
              prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:my-2
              prose-ul:my-2 prose-li:text-muted-foreground prose-li:my-0.5
              prose-ol:my-2
              prose-strong:text-foreground prose-strong:font-semibold
              prose-hr:border-border prose-hr:my-6
              prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground
            ">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-display font-bold text-xl text-foreground mt-8 mb-3 first:mt-0">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-display font-semibold text-lg text-foreground mt-7 mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-5 bg-primary rounded-full inline-block flex-shrink-0" />
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-semibold text-base text-foreground mt-5 mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm text-muted-foreground leading-relaxed my-2">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="my-2 space-y-1.5 ml-4">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="my-2 space-y-1.5 ml-4 list-decimal">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-sm text-muted-foreground leading-relaxed flex gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0 mt-2" />
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  hr: () => <hr className="border-border my-6" />,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary/30 pl-4 italic text-muted-foreground my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {itineraryText}
              </ReactMarkdown>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-3xl p-8 text-center"
          >
            <Globe className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
            <p className="text-sm text-muted-foreground mb-4">
              No itinerary content saved for this trip yet.
            </p>
            <Link
              href={`/AIPlanner?q=${encodeURIComponent(`Plan a trip to ${trip.destination}`)}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Generate itinerary →
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}