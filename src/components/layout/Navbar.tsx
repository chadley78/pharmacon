'use client'

import React from 'react';
import Link from 'next/link'
import { useEffect, useState, Suspense, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import CartIcon from '@/components/cart/CartIcon'
import { useRouter, usePathname } from 'next/navigation'
import { UserIcon, Bars3Icon, XMarkIcon, HomeIcon } from '@heroicons/react/24/outline'
import { SearchBar } from '@/components/ui/SearchBar'

// Mobile menu component
function MobileMenu({ isOpen, onClose, session, isAdmin, handleSignOut }: { 
  isOpen: boolean
  onClose: () => void
  session: unknown
  isAdmin: boolean
  handleSignOut: () => void 
}) {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Menu panel */}
      <div 
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-8 w-8" />
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/products"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                  onClick={onClose}
                >
                  Products
                </Link>
              </li>
              {session ? (
                <>
                  {/* Account Section */}
                  <li className="pt-4">
                    <div className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Account
                    </div>
                    <ul className="mt-2 space-y-1">
                      <li>
                        <Link
                          href="/account"
                          className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                          onClick={onClose}
                        >
                          Overview
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/consultations"
                          className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                          onClick={onClose}
                        >
                          My Consultations
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/orders"
                          className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                          onClick={onClose}
                        >
                          Order History
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/account/questionnaires"
                          className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                          onClick={onClose}
                        >
                          My Questionnaires
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Admin Section */}
                  {isAdmin && (
                    <li className="pt-4">
                      <div className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Admin
                      </div>
                      <ul className="mt-2 space-y-1">
                        <li>
                          <Link
                            href="/admin/questionnaires"
                            className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                            onClick={onClose}
                          >
                            Questionnaires
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}

                  {/* Sign Out */}
                  <li className="pt-4 border-t mt-4">
                    <button
                      onClick={() => {
                        handleSignOut()
                        onClose()
                      }}
                      className="w-full text-left px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                      onClick={onClose}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                      onClick={onClose}
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export default function Navbar() {
  const [session, setSession] = useState<unknown>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const isTransparentPage = pathname === '/' || pathname.startsWith('/products/')

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const checkAdminStatus = useCallback(async (userId: string) => {
    console.log('Checking admin status for user:', userId)
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    console.log('Admin check result:', { data, error })
    setIsAdmin(!!data && !error)
  }, [supabase])

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
  }, [supabase.auth, checkAdminStatus])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isTransparentPage 
        ? isScrolled 
          ? 'bg-white/80 backdrop-blur-sm shadow-sm' 
          : 'bg-transparent'
        : 'bg-white shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Left section with logo and search */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`sm:hidden p-2 rounded-md ${
                isTransparentPage && !isScrolled 
                  ? 'text-text-dark hover:bg-white/10' 
                  : 'hover:bg-gray-100'
              }`}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-8 w-8" />
            </button>

            <Link 
              href="/" 
              className={`flex items-center p-2 rounded-md transition-colors ${
                isTransparentPage && !isScrolled
                  ? 'text-text-dark hover:text-text-dark/80' 
                  : 'text-gray-700 hover:text-black'
              }`}
            >
              <HomeIcon className="h-8 w-8" />
            </Link>

            {/* Search bar - hidden on mobile */}
            <div className="hidden sm:block w-64">
              <Suspense fallback={
                <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md" />
              }>
                <SearchBar 
                  placeholder="Search products..."
                  className={`w-full ${isTransparentPage && !isScrolled ? 'bg-white/10 text-text-dark placeholder-text-dark/70' : ''}`}
                  debounceMs={500}
                />
              </Suspense>
            </div>
          </div>

          {/* Right section - cart and mobile search */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile search - shown only on mobile */}
            <div className="sm:hidden w-32">
              <SearchBar 
                placeholder="Search..."
                className={`w-full ${isTransparentPage && !isScrolled ? 'bg-white/10 text-text-dark placeholder-text-dark/70' : ''}`}
                debounceMs={500}
              />
            </div>

            {/* Cart icon - always visible */}
            <div className="relative">
              <CartIcon className={isTransparentPage && !isScrolled ? 'text-text-dark' : ''} />
            </div>

            {/* Desktop menu items */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                href="/products"
                className={`${
                  isTransparentPage && !isScrolled
                    ? 'text-text-dark hover:text-text-dark/80' 
                    : 'text-gray-700 hover:text-black'
                } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Products
              </Link>
              {session ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin/questionnaires"
                      className={`${
                        isTransparentPage && !isScrolled
                          ? 'text-text-dark hover:text-text-dark/80' 
                          : 'text-gray-700 hover:text-black'
                      } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className={`w-9 h-9 flex items-center justify-center rounded-full ${
                      isTransparentPage && !isScrolled
                        ? 'bg-white/10 text-text-dark hover:bg-white/20' 
                        : 'bg-gray-100 text-gray-900 hover:bg-yellow-400 hover:text-black'
                    } transition-colors duration-150 shadow-sm focus:outline-none`}
                    aria-label="Account"
                  >
                    <UserIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className={`${
                      isTransparentPage && !isScrolled
                        ? 'text-text-dark hover:text-text-dark/80' 
                        : 'text-gray-700 hover:text-black'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`${
                      isTransparentPage && !isScrolled
                        ? 'text-text-dark hover:text-text-dark/80' 
                        : 'text-gray-700 hover:text-black'
                    } px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className={`${
                      isTransparentPage && !isScrolled
                        ? 'bg-text-dark text-white hover:bg-text-dark/90' 
                        : 'bg-yellow-400 text-black hover:bg-yellow-300'
                    } px-3 py-2 rounded-md text-sm font-bold transition-colors`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        session={session}
        isAdmin={isAdmin}
        handleSignOut={handleSignOut}
      />
    </nav>
  )
} 