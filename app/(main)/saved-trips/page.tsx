'use client';

import { useEffect, useState } from 'react';
import { Bookmark, MapPin, Clock, Trash2, Globe, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SavedTrip {
  id: string;
  title: string;
  destination: string;
  duration_days: string | null;
  budget: string | null;
  cover_image_url: string | null;
  notes: string | null;
  created_at: string;
}

export default function SavedTripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/user/trips', { credentials: 'include' })
      .then(r => r.ok ? r.json() : [])
      .then(data => setTrips(Array.isArray(data) ? data : []))
      .catch(() => setTrips([]))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault(); // stop Link navigation
    e.stopPropagation();
    setTrips(prev => prev.filter(t => t.id !== id));
    await fetch(`/api/user/trips/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    }).catch(() => null);
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Saved Trips</h1>
          <p className="text-muted-foreground mt-1">Your curated travel collection</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-border bg-card h-64 animate-pulse" />
            ))}
          </div>
        ) : trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="font-display font-semibold text-xl text-foreground mb-2">No saved trips yet</h2>
            <p className="text-muted-foreground max-w-sm mb-6">
              Use the AI Planner to create itineraries, then save them here for later.
            </p>
            <Link
              href="/AIPlanner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Start planning →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map(trip => (
              <Link
                key={trip.id}
                href={`/saved-trips/${trip.id}`}
                className="group rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-md transition-all block"
              >
                {/* Cover */}
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center relative overflow-hidden">
                  {trip.cover_image_url ? (
                    <img
                      src={trip.cover_image_url}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Globe className="w-12 h-12 text-primary/30" strokeWidth={1} />
                  )}
                  {/* Delete button */}
                  <button
                    onClick={(e) => handleDelete(e, trip.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 z-10"
                    aria-label="Delete trip"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {trip.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all mt-0.5" />
                  </div>

                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{trip.destination}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {trip.duration_days && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {trip.duration_days} days
                      </div>
                    )}
                    {trip.budget && (
                      <div className="flex items-center gap-1">
                        💰 {trip.budget}
                      </div>
                    )}
                  </div>

                  {trip.notes && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{trip.notes}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}