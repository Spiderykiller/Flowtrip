'use client'

import { QueryClientProvider as TanstackProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'

export function QueryClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <TanstackProvider client={queryClientInstance}>
      {children}
    </TanstackProvider>
  )
}