'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { useState } from 'react'
import { ToastProvider } from '@/hooks/use-toast'
import { Toaster } from '@/components/toaster'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }))

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange={false}
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </ToastProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}


