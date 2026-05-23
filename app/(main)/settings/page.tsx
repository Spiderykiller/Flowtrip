'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useTheme, type Theme } from '@/lib/ThemeContext';
import { User, Shield, Sliders, Bell, Save, Loader2, Palette, Sun, Moon, Monitor } from 'lucide-react';

type Tab = 'profile' | 'security' | 'preferences' | 'appearance' | 'notifications';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile',      label: 'Profile',      icon: User },
  { id: 'security',     label: 'Security',     icon: Shield },
  { id: 'preferences',  label: 'Preferences',  icon: Sliders },
  { id: 'appearance',   label: 'Appearance',   icon: Palette },
  { id: 'notifications',label: 'Notifications',icon: Bell },
];

const TRAVEL_STYLES = ['Adventure', 'Luxury', 'Budget', 'Cultural', 'Family', 'Solo'];
const CLIMATES = ['Tropical', 'Cold', 'Temperate', 'Desert', 'Mediterranean'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const THEME_OPTIONS: { id: Theme; label: string; description: string; icon: React.ElementType }[] = [
  {
    id: 'light',
    label: 'Light',
    description: 'Clean white interface, best for bright environments',
    icon: Sun,
  },
  {
    id: 'dark',
    label: 'Dark',
    description: 'Dark navy interface, easier on the eyes at night',
    icon: Moon,
  },
  {
    id: 'system',
    label: 'System',
    description: 'Follows your device\'s light/dark mode setting',
    icon: Monitor,
  },
];

// Theme preview mini-mockup colors
const THEME_PREVIEW: Record<Theme, { bg: string; card: string; text: string; accent: string }> = {
  light:  { bg: '#f0f4f8', card: '#ffffff', text: '#0f172a', accent: '#3b82f6' },
  dark:   { bg: '#0b1222', card: '#0f1a2e', text: '#f0f6fc', accent: '#3b82f6' },
  system: { bg: 'linear-gradient(135deg, #f0f4f8 50%, #0b1222 50%)', card: '#ffffff', text: '#0f172a', accent: '#3b82f6' },
};

export default function SettingsPage() {
  const { user, refresh } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    bio: '',
    location: '',
    website: '',
    preferred_travel_style: '',
    preferred_climate: '',
    currency: 'USD',
    email_notifications: true,
    trip_reminders: true,
  });

  // Load profile from DB
  useEffect(() => {
    fetch('/api/user/profile', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data) setProfile(prev => ({ ...prev, ...data }));
        else if (user) setProfile(prev => ({ ...prev, full_name: user.full_name || '' }));
      })
      .catch(() => {
        if (user) setProfile(prev => ({ ...prev, full_name: user.full_name || '' }));
      });
  }, [user]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(profile),
      });
      await refresh();
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // swallow
    } finally {
      setSaving(false);
    }
  }

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const showSave = activeTab !== 'security' && activeTab !== 'appearance';

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="md:w-56 flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-4 h-4 flex-shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">

              {/* ── PROFILE TAB ── */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="font-display font-semibold text-lg text-foreground">Profile</h2>

                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user?.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Avatar is generated from your initials</p>
                    </div>
                  </div>

                  <Field label="Full Name">
                    <input
                      type="text"
                      value={profile.full_name}
                      onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                      placeholder="Your full name"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Bio">
                    <textarea
                      value={profile.bio}
                      onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                      placeholder="Tell us about yourself and your travel style…"
                      rows={3}
                      className={inputCls + ' resize-none'}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Location">
                      <input
                        type="text"
                        value={profile.location}
                        onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                        placeholder="City, Country"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Website">
                      <input
                        type="url"
                        value={profile.website}
                        onChange={e => setProfile(p => ({ ...p, website: e.target.value }))}
                        placeholder="https://yoursite.com"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </div>
              )}

              {/* ── SECURITY TAB ── */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="font-display font-semibold text-lg text-foreground">Security</h2>

                  <div className="bg-muted/50 rounded-xl p-4 border border-border">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Password managed by Base44</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          Your password is managed through your Base44 account. To change it, visit your Base44 account settings or use the "Forgot password" flow on the login page.
                        </p>
                        <a
                          href="https://app.base44.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                        >
                          Manage on Base44 →
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-medium text-foreground">Connected Account</h3>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user?.email}</p>
                          <p className="text-xs text-muted-foreground">Base44 account</p>
                        </div>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── PREFERENCES TAB ── */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="font-display font-semibold text-lg text-foreground">Preferences</h2>

                  <Field label="Travel Style">
                    <div className="flex flex-wrap gap-2">
                      {TRAVEL_STYLES.map(style => (
                        <button
                          key={style}
                          onClick={() => setProfile(p => ({
                            ...p,
                            preferred_travel_style: p.preferred_travel_style === style.toLowerCase() ? '' : style.toLowerCase()
                          }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            profile.preferred_travel_style === style.toLowerCase()
                              ? 'bg-primary text-white border-primary'
                              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Preferred Climate">
                    <div className="flex flex-wrap gap-2">
                      {CLIMATES.map(climate => (
                        <button
                          key={climate}
                          onClick={() => setProfile(p => ({
                            ...p,
                            preferred_climate: p.preferred_climate === climate.toLowerCase() ? '' : climate.toLowerCase()
                          }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            profile.preferred_climate === climate.toLowerCase()
                              ? 'bg-primary text-white border-primary'
                              : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
                          }`}
                        >
                          {climate}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="Currency">
                    <select
                      value={profile.currency}
                      onChange={e => setProfile(p => ({ ...p, currency: e.target.value }))}
                      className={inputCls}
                    >
                      {CURRENCIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              )}

              {/* ── APPEARANCE TAB ── */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-display font-semibold text-lg text-foreground">Appearance</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose how FlowTrip looks for you. Changes apply instantly.
                    </p>
                  </div>

                  {/* Theme cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {THEME_OPTIONS.map(option => {
                      const preview = THEME_PREVIEW[option.id];
                      const isActive = theme === option.id;
                      return (
                        <button
                          key={option.id}
                          onClick={() => setTheme(option.id)}
                          className={`group relative flex flex-col rounded-2xl border-2 overflow-hidden text-left transition-all ${
                            isActive
                              ? 'border-primary shadow-md shadow-primary/10'
                              : 'border-border hover:border-primary/40'
                          }`}
                        >
                          {/* Preview mockup */}
                          <div
                            className="h-28 w-full relative"
                            style={{ background: preview.bg }}
                          >
                            {/* Mini navbar */}
                            <div
                              className="absolute top-3 left-3 right-3 h-5 rounded-lg flex items-center px-2 gap-1.5"
                              style={{ background: option.id === 'dark' ? '#1a2744' : '#ffffff', opacity: 0.9 }}
                            >
                              <div className="w-2.5 h-2.5 rounded-full" style={{ background: preview.accent }} />
                              <div className="flex-1 h-1.5 rounded-full" style={{ background: option.id === 'dark' ? '#2a3a5c' : '#e2e8f0' }} />
                              <div className="w-6 h-1.5 rounded-full" style={{ background: preview.accent }} />
                            </div>
                            {/* Mini cards */}
                            <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                              {[1, 2].map(i => (
                                <div
                                  key={i}
                                  className="flex-1 h-8 rounded-lg"
                                  style={{
                                    background: option.id === 'system'
                                      ? i === 1 ? '#ffffff' : '#1a2744'
                                      : preview.card,
                                    opacity: 0.85,
                                  }}
                                />
                              ))}
                            </div>
                            {/* Active checkmark */}
                            {isActive && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Label */}
                          <div className="px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <option.icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                              <span className={`text-sm font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                                {option.label}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {option.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Current status */}
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl border border-border">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-sm text-muted-foreground">
                      Currently using{' '}
                      <span className="font-medium text-foreground">
                        {theme === 'system' ? `System (${resolvedTheme})` : theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </span>{' '}
                      mode
                    </p>
                  </div>
                </div>
              )}

              {/* ── NOTIFICATIONS TAB ── */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="font-display font-semibold text-lg text-foreground">Notifications</h2>

                  <div className="space-y-4">
                    <Toggle
                      label="Email Notifications"
                      description="Receive updates about your trips and account activity"
                      checked={profile.email_notifications}
                      onChange={v => setProfile(p => ({ ...p, email_notifications: v }))}
                    />
                    <Toggle
                      label="Trip Reminders"
                      description="Get reminders about upcoming trips you've saved"
                      checked={profile.trip_reminders}
                      onChange={v => setProfile(p => ({ ...p, trip_reminders: v }))}
                    />
                  </div>
                </div>
              )}

              {/* Save button — not shown on Security or Appearance */}
              {showSave && (
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  {saved && (
                    <span className="text-sm text-green-600 font-medium">✓ Changes saved</span>
                  )}
                  <div className="ml-auto">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-medium rounded-full hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      {saving ? 'Saving…' : 'Save changes'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label, description, checked, onChange
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors ${
          checked ? 'bg-primary' : 'bg-muted'
        }`}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

const inputCls = 'w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors';