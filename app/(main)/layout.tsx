'use client'

import AppLayout from '@/components/layout/AppLayout'
import UserNotRegisteredError from '@/components/Usernotregisterederror'
import { useAuth } from '@/lib/AuthContext'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { authError } = useAuth()

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />
  }

  return <AppLayout>{children}</AppLayout>
}