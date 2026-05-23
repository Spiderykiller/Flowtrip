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
  { label: 'Explore', path: '/' },
  { label: 'Destinations', path: '/Destinations' },
  { label: 'How It Works', path: '/HowItWorks' },
  { label: 'AI Planner', path: '/AIPlanner' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [dbName, setDbName] = useState<string | null>(null);

  
  useEffect(() => {
    if (!isAuthenticated) return;
      fetch('/api/user/profile', { credentials: 'include' })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data?.full_name) setDbName(data.full_name); })
        .catch(() => null);
    }, [isAuthenticated]);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navBg =
    scrolled || !isHome
      ? 'bg-white/90 backdrop-blur-xl border-b border-border/50 shadow-sm'
      : 'bg-transparent';

  const textColor = !scrolled && isHome ? 'text-white' : 'text-foreground';

  // Get initials for avatar
  const resolvedName = dbName || user?.full_name;
  const initials = resolvedName
    ? resolvedName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  const displayName = resolvedName || user?.email?.split('@')[0] || 'Traveler';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-[72px]">

          {/* Logo */}
          <Link
            href="/"
            className={`flex items-center gap-2.5 transition-colors ${
              scrolled || !isHome ? 'text-foreground' : 'text-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              scrolled || !isHome ? 'bg-primary' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Plane className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Flow
              <span className={scrolled || !isHome ? 'text-primary' : 'text-blue-300'}>
                Trip
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.path;
              const isAI = link.path === '/AIPlanner';
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors rounded-full
                    ${isActive ? 'text-primary' : `${textColor} hover:text-primary`}
                    ${isAI && !isActive ? 'text-primary font-semibold' : ''}
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

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-colors ${
                    scrolled || !isHome
                      ? 'hover:bg-muted'
                      : 'hover:bg-white/10'
                  }`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {initials}
                  </div>
                  {/* Name */}
                  <span className={`text-sm font-medium max-w-[120px] truncate ${
                    scrolled || !isHome ? 'text-foreground' : 'text-white'
                  }`}>
                    {displayName}
                  </span>
                  {/* Chevron */}
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className={`transition-transform duration-200 flex-shrink-0 ${userMenuOpen ? 'rotate-180' : ''} ${
                      scrolled || !isHome ? 'text-muted-foreground' : 'text-white/60'
                    }`}
                  >
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-border p-2 z-50"
                    >
                      {/* User info header */}
                      <div className="px-3 py-3 mb-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border my-1" />

                      {/* Menu items */}
                      <Link
                        href="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        Profile
                      </Link>

                      <Link
                        href="/saved-trips"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-muted-foreground" />
                        Saved Trips
                      </Link>

                      <Link
                        href="/settings"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground hover:bg-muted rounded-xl transition-colors"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Settings
                      </Link>

                      <div className="border-t border-border my-1" />

                      <button
                        onClick={() => { setUserMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  scrolled || !isHome
                    ? 'text-foreground hover:text-primary'
                    : 'text-white hover:text-blue-200'
                }`}
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

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${textColor}`}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-border overflow-hidden z-40"
          >
            <div className="px-6 py-6 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-colors ${
                      isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="pt-4 space-y-2 border-t border-border mt-2">
                {isAuthenticated && user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 px-4 py-2">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{displayName}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted rounded-xl">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link href="/saved-trips" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted rounded-xl">
                      <Bookmark className="w-4 h-4" /> Saved Trips
                    </Link>
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted rounded-xl">
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-3 px-4 py-3 w-full text-sm text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/login')}
                    className="block w-full text-center py-3 text-sm font-medium text-foreground border border-border rounded-full hover:bg-muted transition-colors"
                  >
                    Sign in
                  </button>
                )}

                <Link
                  href="/AIPlanner"
                  className="block w-full text-center h-12 leading-[3rem] text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                  Start planning →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}