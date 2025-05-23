import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { Suspense } from 'react'
import { QuestionnaireApprovalsList } from '@/components/QuestionnaireApprovalsList'

interface QuestionnaireApproval {
  id: string
  created_at: string
  status: 'approved' | 'rejected'
  user_id: string
  questionnaire_answers: {
    over18: boolean
    noHeartProblems: boolean
    noNitrates: boolean
    noLiverProblems: boolean
    noRecentStroke: boolean
  }
  product: {
    name: string
    slug: string
  }
  user: {
    email: string
  }
}

export default async function AdminQuestionnairesPage() {
  // Use the admin client for admin checks
  const adminClient = createAdminClient()
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?redirect=/admin/questionnaires')
  }

  // Use admin client to check if user is an admin
  const { data: adminData, error: adminError } = await adminClient
    .from('admin_users')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (adminError || !adminData) {
    redirect('/')
  }

  // Fetch all questionnaire approvals (can use adminClient or supabase as needed)
  const { data: approvals, error } = await adminClient
    .from('questionnaire_approvals')
    .select(`
      *,
      product:products (
        name,
        slug
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching questionnaire approvals:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">Error</h2>
          <p className="text-red-600">Could not load questionnaire submissions. Please try again later.</p>
        </div>
      </div>
    )
  }

  const questionnaireApprovals = approvals as QuestionnaireApproval[]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Questionnaire Approvals</h1>
        <p className="text-gray-600 mt-2">
          Review and manage medical questionnaire submissions.
        </p>
      </div>

      <Suspense fallback={
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-6 w-24 bg-gray-200 rounded"></div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="h-4 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      }>
        <QuestionnaireApprovalsList approvals={questionnaireApprovals} />
      </Suspense>
    </div>
  )
} 