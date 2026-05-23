'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import {
  User, MapPin, Globe, FileText, Pencil, Check, X,
  Bookmark, Settings, LogOut, Plane, Calendar,
} from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  preferred_travel_style: string | null;
  preferred_climate: string | null;
  currency: string;
  created_at: string;
}

const STYLE_EMOJI: Record<string, string> = {
  adventure: '🧗',
  luxury: '✨',
  budget: '💰',
  cultural: '🏛️',
  family: '👨‍👩‍👧',
  solo: '🎒',
};

const CLIMATE_EMOJI: Record<string, string> = {
  tropical: '🌴',
  cold: '❄️',
  temperate: '🌤️',
  desert: '🏜️',
  mediterranean: '🫒',
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState({ full_name: '', bio: '', location: '', website: '' });
  const [tripCount, setTripCount] = useState<number>(0);

  useEffect(() => {
    Promise.all([
      fetch('/api/user/profile', { credentials: 'include' })
        .then(r => r.ok ? r.json() : null),
      fetch('/api/user/trips', { credentials: 'include' })
        .then(r => r.ok ? r.json() : []),
    ]).then(([profileData, tripsData]) => {
      if (profileData) {
        setProfile(profileData);
        setEditValues({
          full_name: profileData.full_name ?? '',
          bio: profileData.bio ?? '',
          location: profileData.location ?? '',
          website: profileData.website ?? '',
        });
      } else if (user) {
        const fallback = {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url ?? null,
          bio: null,
          location: null,
          website: null,
          preferred_travel_style: null,
          preferred_climate: null,
          currency: 'USD',
          created_at: new Date().toISOString(),
        };
        setProfile(fallback);
        setEditValues({ full_name: user.full_name ?? '', bio: '', location: '', website: '' });
      }
      setTripCount(Array.isArray(tripsData) ? tripsData.length : 0);
    }).catch(() => {
      if (user) {
        setProfile({
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          avatar_url: user.avatar_url ?? null,
          bio: null,
          location: null,
          website: null,
          preferred_travel_style: null,
          preferred_climate: null,
          currency: 'USD',
          created_at: new Date().toISOString(),
        });
      }
    }).finally(() => setLoading(false));
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editValues),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setEditing(false);
      }
    } catch {
      // swallow
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    if (profile) {
      setEditValues({
        full_name: profile.full_name ?? '',
        bio: profile.bio ?? '',
        location: profile.location ?? '',
        website: profile.website ?? '',
      });
    }
    setEditing(false);
  }

  const initials = (profile?.full_name || user?.full_name)
    ? (profile?.full_name || user?.full_name)!.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const displayName = profile?.full_name || user?.full_name || user?.email?.split('@')[0] || 'Traveler';

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10 space-y-6">
          <div className="h-48 rounded-2xl bg-muted animate-pulse" />
          <div className="h-32 rounded-2xl bg-muted animate-pulse" />
          <div className="h-24 rounded-2xl bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6 md:px-10 space-y-5">

        {/* ── Hero Card ── */}
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden">
          {/* Banner gradient */}
          <div className="h-28 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />

          {/* Avatar + actions */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-10 mb-4">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-primary border-4 border-card flex items-center justify-center text-white text-2xl font-bold shadow-md flex-shrink-0">
                {initials}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pb-1">
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-muted transition-colors text-foreground"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-muted transition-colors text-foreground"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Name + email */}
            {editing ? (
              <input
                type="text"
                value={editValues.full_name}
                onChange={e => setEditValues(p => ({ ...p, full_name: e.target.value }))}
                placeholder="Your full name"
                className={inputCls + ' mb-2 text-lg font-semibold'}
              />
            ) : (
              <h1 className="font-display text-xl font-bold text-foreground mb-0.5">{displayName}</h1>
            )}
            <p className="text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
              {(editing ? editValues.location : profile?.location) ? (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {editing ? editValues.location : profile?.location}
                </span>
              ) : null}
              {(editing ? editValues.website : profile?.website) ? (
                <a
                  href={editing ? editValues.website : profile?.website ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-primary hover:underline"
                >
                  <Globe className="w-3 h-3" />
                  {(editing ? editValues.website : profile?.website ?? '').replace(/^https?:\/\//, '')}
                </a>
              ) : null}
              {memberSince && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Member since {memberSince}
                </span>
              )}
            </div>

            {/* Bio */}
            <div className="mt-4">
              {editing ? (
                <textarea
                  value={editValues.bio}
                  onChange={e => setEditValues(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell us about yourself and your travel style…"
                  rows={3}
                  className={inputCls + ' resize-none'}
                />
              ) : profile?.bio ? (
                <p className="text-sm text-muted-foreground leading-relaxed">{profile.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground/50 italic">No bio yet — click Edit profile to add one.</p>
              )}
            </div>

            {/* Edit extra fields */}
            {editing && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Location</label>
                  <input
                    type="text"
                    value={editValues.location}
                    onChange={e => setEditValues(p => ({ ...p, location: e.target.value }))}
                    placeholder="City, Country"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Website</label>
                  <input
                    type="url"
                    value={editValues.website}
                    onChange={e => setEditValues(p => ({ ...p, website: e.target.value }))}
                    placeholder="https://yoursite.com"
                    className={inputCls}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={Bookmark} label="Saved Trips" value={tripCount.toString()} href="/saved-trips" />
          <StatCard
            icon={Plane}
            label="Travel Style"
            value={
              profile?.preferred_travel_style
                ? `${STYLE_EMOJI[profile.preferred_travel_style] ?? '✈️'} ${
                    profile.preferred_travel_style.charAt(0).toUpperCase() +
                    profile.preferred_travel_style.slice(1)
                  }`
                : '—'
            }
            href="/settings?tab=preferences"
          />
          <StatCard
            icon={Globe}
            label="Climate Pref"
            value={
              profile?.preferred_climate
                ? `${CLIMATE_EMOJI[profile.preferred_climate] ?? '🌍'} ${
                    profile.preferred_climate.charAt(0).toUpperCase() +
                    profile.preferred_climate.slice(1)
                  }`
                : '—'
            }
            href="/settings?tab=preferences"
          />
        </div>

        {/* ── Quick Links ── */}
        <div className="bg-card border border-border rounded-2xl divide-y divide-border overflow-hidden">
          <QuickLink icon={Bookmark} label="Saved Trips" description="View your curated travel collection" href="/saved-trips" />
          <QuickLink icon={Settings} label="Settings" description="Profile, preferences, notifications" href="/settings" />
          <QuickLink icon={Plane} label="AI Planner" description="Plan a new trip with AI" href="/AIPlanner" />
        </div>

        {/* ── Sign Out ── */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon, label, value, href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 hover:shadow-sm transition-all group text-center"
    >
      <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
      <p className="text-base font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
    </Link>
  );
}

function QuickLink({
  icon: Icon, label, description, href,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-5 py-4 hover:bg-muted transition-colors group"
    >
      <div className="w-9 h-9 rounded-xl bg-muted group-hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <svg className="w-4 h-4 text-muted-foreground ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 18l6-6-6-6" />
      </svg>
    </Link>
  );
}

const inputCls = 'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';