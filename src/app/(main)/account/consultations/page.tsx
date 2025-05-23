import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { ConsultationRequestsList } from '@/components/ConsultationRequestsList'

export default async function ConsultationsPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?redirect=/account/consultations')
  }

  // Fetch user's consultation requests
  const { data: consultationRequests, error: fetchError } = await supabase
    .from('consultation_requests')
    .select(`
      *,
      products (
        name,
        description,
        price
      )
    `)
    .order('created_at', { ascending: false })

  if (fetchError) {
    console.error('Error fetching consultation requests:', fetchError)
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Consultations</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          There was an error loading your consultation requests. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Consultations</h1>
      <Suspense fallback={
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }>
      <ConsultationRequestsList requests={consultationRequests || []} />
      </Suspense>
    </div>
  )
} 