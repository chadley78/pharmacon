'use client'

import React from 'react';
import Link from 'next/link'
import { useEffect, useState, Suspense, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Session } from '@supabase/supabase-js'
import CartIcon from '@/components/cart/CartIcon'
import { useRouter, usePathname } from 'next/navigation'
import { UserIcon, Bars3Icon, XMarkIcon, HomeIcon, ClipboardDocumentListIcon, CubeIcon, ChartBarIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { SearchBar } from '@/components/ui/SearchBar'

// Mobile menu component
function MobileMenu({ isOpen, onClose, session, isAdmin, handleSignOut }: { 
  isOpen: boolean
  onClose: () => void
  session: Session | null
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
                            href="/admin"
                            className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                            onClick={onClose}
                          >
                            <div className="flex items-center">
                              <Cog6ToothIcon className="h-5 w-5 mr-2" />
                              Dashboard
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/products"
                            className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                            onClick={onClose}
                          >
                            <div className="flex items-center">
                              <CubeIcon className="h-5 w-5 mr-2" />
                              Products
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/orders"
                            className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                            onClick={onClose}
                          >
                            <div className="flex items-center">
                              <ChartBarIcon className="h-5 w-5 mr-2" />
                              Orders
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/questionnaires"
                            className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                            onClick={onClose}
                          >
                            <div className="flex items-center">
                              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                              Questionnaires
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/users"
                            className="block px-4 py-2.5 text-gray-900 hover:bg-gray-50 rounded-md font-medium hover:text-black transition-colors"
                            onClick={onClose}
                          >
                            <div className="flex items-center">
                              <UsersIcon className="h-5 w-5 mr-2" />
                              Admin Users
                            </div>
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
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const isTransparentPage = pathname === '/' || pathname.startsWith('/products/')

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 0)
  }, [setIsScrolled])

  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const checkAdminStatus = useCallback(async (email: string) => {
    console.log('Checking admin status for email:', email)
    if (!email) {
      console.log('No email provided, setting isAdmin to false')
      setIsAdmin(false)
      return
    }

    try {
      console.log('Making request to check admin status...')
      const response = await fetch(`/api/admin/check-status?email=${encodeURIComponent(email)}`)
      console.log('Admin status response status:', response.status)
      
      const data = await response.json()
      console.log('Admin status response data:', data)
      
      if (!response.ok) {
        console.error('Admin status check failed:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          details: data.details
        })
        throw new Error(data.error || 'Failed to check admin status')
      }
      
      console.log('Admin check result:', data)
      setIsAdmin(data.isAdmin)
    } catch (error) {
      console.error('Error checking admin status:', error)
      if (error instanceof Error) {
        console.error('Error details:', error.message)
      }
      setIsAdmin(false)
    }
  }, [])

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial auth state:', session?.user?.email)
      setSession(session)
      if (session?.user?.email) {
        checkAdminStatus(session.user.email)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', session?.user?.email)
      setSession(session)
      if (session?.user?.email) {
        checkAdminStatus(session.user.email)
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
                    <div className="relative group">
                      <button
                        className={`${
                          isTransparentPage && !isScrolled
                            ? 'text-text-dark hover:text-text-dark/80' 
                            : 'text-gray-700 hover:text-black'
                        } px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center`}
                      >
                        Admin
                        <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="py-1">
                          <Link
                            href="/admin"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <Cog6ToothIcon className="h-5 w-5 mr-2" />
                              Dashboard
                            </div>
                          </Link>
                          <Link
                            href="/admin/products"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <CubeIcon className="h-5 w-5 mr-2" />
                              Products
                            </div>
                          </Link>
                          <Link
                            href="/admin/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <ChartBarIcon className="h-5 w-5 mr-2" />
                              Orders
                            </div>
                          </Link>
                          <Link
                            href="/admin/questionnaires"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                              Questionnaires
                            </div>
                          </Link>
                          <Link
                            href="/admin/users"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <div className="flex items-center">
                              <UsersIcon className="h-5 w-5 mr-2" />
                              Admin Users
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
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