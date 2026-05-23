'use client';

import Navbar from './Navbar';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* The Guidance Line */}
      <div className="guidance-line" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 pt-16 md:pt-[72px]">
        {children}
      </main>

      <Footer />
    </div>
  );
}