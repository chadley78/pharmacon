import Navbar from '@/components/layout/Navbar'
import { Suspense } from 'react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={
        <div className="h-16 bg-white shadow-sm animate-pulse" />
      }>
        <Navbar />
      </Suspense>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 