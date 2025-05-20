import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">My Consultations</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          There was an error loading your consultation requests. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">My Consultations</h1>
      <ConsultationRequestsList requests={consultationRequests || []} />
    </div>
  )
} 