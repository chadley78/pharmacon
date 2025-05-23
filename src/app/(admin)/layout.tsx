import Navbar from '@/components/layout/Navbar'
import { Suspense } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="h-16 bg-white shadow-sm animate-pulse" />
      }>
        <Navbar />
      </Suspense>
      <main>{children}</main>
    </div>
  )
} 