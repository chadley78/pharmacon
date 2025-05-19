'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh() // Refresh the page to update auth state
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-700 hover:text-gray-900"
    >
      Sign out
    </button>
  )
} 