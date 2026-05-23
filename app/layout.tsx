import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { QueryClientProvider } from '@/components/providers/query-client-provider'
import { ThemeProvider } from '@/lib/ThemeContext'
import './globals.css'
import { AuthProvider } from '@/lib/AuthContext';

export const metadata: Metadata = {
  title: 'FlowTrip',
  description:
    "FlowTrip's AI understands context, budget, vibe, and pace — then builds a trip that actually fits your life.",
  icons: {
    icon: { url: 'https://base44.com/logo_v2.svg', type: 'image/svg+xml' },
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script — runs before React hydrates, prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('flowtrip-theme') || 'system';
                  var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (dark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            <QueryClientProvider>
              {children}
              <Toaster />
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
