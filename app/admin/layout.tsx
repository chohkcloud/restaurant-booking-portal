'use client'

import React from 'react'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AdminAuthProvider>
  )
}