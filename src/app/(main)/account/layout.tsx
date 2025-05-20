import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="font-semibold text-lg mb-4">Account</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  href="/account/consultations"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  My Consultations
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Order History
                </Link>
              </li>
              <li>
                <Link
                  href="/account/questionnaires"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  My Questionnaires
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 