'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import CartIcon from '@/components/cart/CartIcon'
import { useRouter } from 'next/navigation'
import { UserIcon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const [session, setSession] = useState<unknown>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        checkAdminStatus(session.user.id)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        checkAdminStatus(session.user.id)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const checkAdminStatus = async (userId: string) => {
    console.log('Checking admin status for user:', userId)
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    console.log('Admin check result:', { data, error })
    setIsAdmin(!!data && !error)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-gray-900 font-bold text-2xl tracking-tight">
              Pharmacon
            </Link>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/products"
              className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Products
            </Link>
            <div className="relative">
              <CartIcon />
            </div>
            {session ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin/questionnaires"
                    className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/account"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-900 hover:bg-yellow-400 hover:text-black transition-colors duration-150 shadow-sm focus:outline-none"
                  aria-label="Account"
                >
                  <UserIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-yellow-400 text-black px-3 py-2 rounded-md text-sm font-bold hover:bg-yellow-300 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 