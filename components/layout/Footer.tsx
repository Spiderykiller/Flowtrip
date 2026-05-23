'use client';

import Link from 'next/link';
import { Plane, ArrowUpRight } from 'lucide-react';

interface FooterLink {
  label: string;
  to: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

const FOOTER_LINKS: FooterColumn[] = [
  {
    title: 'Product',
    links: [
      { label: 'Destinations', to: '/Destinations' },
      { label: 'How It Works', to: '/HowItWorks' },
      { label: 'AI Planner', to: '/AIPlanner' },
      { label: 'Community', to: '/Community' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'Careers', to: '/careers' },
      { label: 'Press', to: '/press' },
      { label: 'Contact', to: '/Community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="py-16 md:py-20 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-foreground mb-4"
            >
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Plane className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                Flow<span className="text-primary">Trip</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
              AI-powered travel intelligence for the modern explorer.
              Discover smarter, travel better.
            </p>
          </div>

          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-semibold text-sm text-foreground mb-4 tracking-wide uppercase">
                {col.title}
              </h4>

              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.to}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FlowTrip. All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}