import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'

interface LoginPageProps {
  searchParams: {
    redirect?: string
  }
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient()

  // Check if user is already logged in
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    // If there's a redirect URL, go there, otherwise go to account page
    redirect(searchParams.redirect || '/account')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </a>
          </p>
        </div>
        <LoginForm redirectTo={searchParams.redirect} />
      </div>
    </div>
  )
} 