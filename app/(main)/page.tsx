'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowRight, MapPin, Sparkles, Globe, Search } from 'lucide-react'
import { useRef, useState } from 'react'
import type { MouseEvent, FormEvent } from 'react'

import SectionLabel from '@/components/shared/SectionLabel'
import AnimatedSection from '@/components/shared/AnimatedSection'

const HERO_IMAGE =
  'https://media.base44.com/images/public/69fb16a58289106323fc2ae7/5060e17a0_generated_d8e15eb7.png'

const STATS = [
  { value: '150+', label: 'Destinations' },
  { value: '50K+', label: 'Travelers' },
  { value: '4.9', label: 'Rating' },
]

const QUICK_SEARCHES = [
  '5 days in Tokyo, $2000 budget',
  'Romantic week in Santorini',
  'Solo backpacking Southeast Asia',
  'Family trip to Costa Rica',
]

export default function Home() {
  const router = useRouter()
  const heroRef = useRef<HTMLElement | null>(null)
  const [query, setQuery] = useState('')

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const bgX = useTransform(mouseX, [-500, 500], [10, -10])
  const bgY = useTransform(mouseY, [-500, 500], [10, -10])

  const handleMouseMove = (e: MouseEvent<HTMLElement>): void => {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      router.push('/AIPlanner')
      return
    }
    router.push(`/AIPlanner?q=${encodeURIComponent(q)}`)
  }

  function handleQuickSearch(prompt: string) {
    router.push(`/AIPlanner?q=${encodeURIComponent(prompt)}`)
  }

  return (
    <>
      {/* Hero — Exploration Hub */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative flex min-h-screen items-center overflow-hidden"
      >
        {/* Parallax Background */}
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute inset-[-20px] z-0"
        >
          <img
            src={HERO_IMAGE}
            alt="Expansive golden-hour vista of Santorini cliffs meeting the Aegean Sea, evoking wanderlust and boundless possibility"
            className="h-full w-full scale-105 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 pb-20 pt-28 md:px-10 lg:px-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur-md"
            >
              <Sparkles className="h-4 w-4 text-accent" />
              AI-Powered Travel Intelligence — FlowTrip
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mb-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
            >
              Explore the
              <br />
              World{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Differently
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-8 max-w-xl font-body text-lg leading-relaxed text-white/75 sm:text-xl"
            >
              FlowTrip&apos;s AI analyzes millions of data points to craft your
              perfect journey. From hidden gems to iconic landmarks—travel
              reimagined.
            </motion.p>

            {/* ── Search bar ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mb-5"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-2 max-w-xl">
                <Search className="w-5 h-5 text-white/50 ml-2 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Describe your dream trip…"
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none py-1.5 min-w-0"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 h-10 px-5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Plan it →
                </button>
              </form>

              {/* Quick search chips */}
              <div className="flex flex-wrap gap-2 mt-3">
                {QUICK_SEARCHES.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickSearch(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.72, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/Destinations"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                <Globe className="w-4 h-4" />
                Browse Destinations
              </Link>
              <Link
                href="/HowItWorks"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                How It Works
              </Link>
            </motion.div>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="mt-20 flex flex-wrap gap-10 md:mt-28 md:gap-16"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="text-white">
                <div className="font-display text-3xl font-bold md:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-sm uppercase tracking-wider text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        >
          <div className="flex h-8 w-5 justify-center rounded-full border-2 border-white/30 pt-1.5">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
              className="h-1 w-1 rounded-full bg-white"
            />
          </div>
        </motion.div>
      </section>

      {/* Mini CTA — Quick Navigation */}
      <section className="bg-background py-24 md:py-32">
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
          <AnimatedSection>
            <SectionLabel label="Where to next?" />
            <h2 className="mt-4 mb-6 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Your journey starts here
            </h2>
            <p className="mb-12 max-w-2xl text-lg text-muted-foreground">
              Whether you&apos;re drawn to coastlines, mountains, or ancient
              cities—our AI finds the path that&apos;s uniquely yours.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Globe,
                title: 'Explore Destinations',
                desc: "Browse our curated atlas of the world's most extraordinary places.",
                to: '/Destinations',
              },
              {
                icon: Sparkles,
                title: 'AI Intelligence',
                desc: 'See how our engine analyzes and personalizes your travel experience.',
                to: '/HowItWorks',
              },
              {
                icon: MapPin,
                title: 'Join Community',
                desc: 'Connect with fellow travelers and share your stories from the field.',
                to: '/Community',
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <Link
                  href={item.to}
                  className="group block rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
                >
                  <item.icon className="mb-5 h-8 w-8 text-primary" strokeWidth={1.5} />
                  <h3 className="mb-2 font-display text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}