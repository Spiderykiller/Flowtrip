'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Plane, LogOut, Settings, Bookmark, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';

interface NavLink {
  label: string;
  path: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Explore',      path: '/' },
  { label: 'Destinations', path: '/Destinations' },
  { label: 'How It Works', path: '/HowItWorks' },
  { label: 'AI Planner',   path: '/AIPlanner' },
];

export default function Navbar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [dbName, setDbName] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/user/profile', { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.full_name) setDbName(data.full_name); })
      .catch(() => null);
  }, [isAuthenticated]);

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [pathname]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Derived values ────────────────────────────────────────────────────────
  const resolvedName = dbName || user?.full_name;
  const initials     = resolvedName
    ? resolvedName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';
  const displayName  = resolvedName || user?.email?.split('@')[0] || 'Traveler';

  // On the hero (home, not scrolled) the navbar sits over a dark image →
  // use white text. Everywhere else use theme-aware tokens so dark mode works.
  const overDark  = !scrolled && isHome;

  const navBg     = overDark
    ? 'bg-transparent'
    : 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm';

  const linkColor = overDark
    ? 'text-white hover:text-white/70'
    : 'text-foreground hover:text-primary';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-[72px]">

          {/* ── Logo ── */}
          <Link href="/" className={`flex items-center gap-2.5 transition-colors ${overDark ? 'text-white' : 'text-foreground'}`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${overDark ? 'bg-white/20 backdrop-blur-sm' : 'bg-primary'}`}>
              <Plane className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Flow
              <span className={overDark ? 'text-blue-300' : 'text-primary'}>Trip</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              const isAI     = link.path === '/AIPlanner';
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full
                    ${isActive
                      ? 'text-primary'
                      : isAI && !isActive
                        ? 'text-primary font-semibold'
                        : linkColor}
                  `}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── Desktop right side ── */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                {/* Trigger button */}
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-colors
                    ${overDark ? 'hover:bg-white/10' : 'hover:bg-muted'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  <span className={`text-sm font-medium max-w-[120px] truncate ${overDark ? 'text-white' : 'text-foreground'}`}>
                    {displayName}
                  </span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`transition-transform duration-200 flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''} ${overDark ? 'text-white/60' : 'text-muted-foreground'}`}>
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Dropdown — always uses card tokens so it works in both themes */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-2xl shadow-xl p-2 z-50"
                    >
                      {/* Header */}
                      <div className="px-3 py-3 mb-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-card-foreground truncate">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border my-1" />

                      <Link href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-card-foreground hover:bg-muted rounded-xl transition-colors">
                        <User className="w-4 h-4 text-muted-foreground" /> Profile
                      </Link>
                      <Link href="/saved-trips"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-card-foreground hover:bg-muted rounded-xl transition-colors">
                        <Bookmark className="w-4 h-4 text-muted-foreground" /> Saved Trips
                      </Link>
                      <Link href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-card-foreground hover:bg-muted rounded-xl transition-colors">
                        <Settings className="w-4 h-4 text-muted-foreground" /> Settings
                      </Link>

                      <div className="border-t border-border my-1" />

                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full
                  ${overDark ? 'text-white hover:text-white/70' : 'text-foreground hover:text-primary'}`}
              >
                Sign in
              </button>
            )}

            <Link
              href="/AIPlanner"
              className="inline-flex items-center gap-2 h-10 px-5 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              Start planning →
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${overDark ? 'text-white' : 'text-foreground'}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border backdrop-blur-xl overflow-hidden z-40"
          >
            <div className="px-6 py-6 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-card-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-4 space-y-1 border-t border-border mt-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    <Link href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-card-foreground hover:bg-muted rounded-xl transition-colors">
                      <User className="w-4 h-4 text-muted-foreground" /> Profile
                    </Link>
                    <Link href="/saved-trips"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-card-foreground hover:bg-muted rounded-xl transition-colors">
                      <Bookmark className="w-4 h-4 text-muted-foreground" /> Saved Trips
                    </Link>
                    <Link href="/settings"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-card-foreground hover:bg-muted rounded-xl transition-colors">
                      <Settings className="w-4 h-4 text-muted-foreground" /> Settings
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 px-4 py-3 w-full text-sm text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="w-full text-center py-3 text-sm font-medium text-card-foreground border border-border rounded-full hover:bg-muted transition-colors"
                  >
                    Sign in
                  </button>
                )}

                <div className="pt-2">
                  <Link
                    href="/AIPlanner"
                    className="block w-full text-center py-3 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                  >
                    Start planning →
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}