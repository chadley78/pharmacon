import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { QuestionnairesList } from '@/components/QuestionnairesList'

interface QuestionnaireApproval {
  id: string
  created_at: string
  status: 'approved' | 'rejected'
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
}

export default async function QuestionnairesPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login?redirect=/account/questionnaires')
  }

  // Fetch user's questionnaire approvals
  const { data: questionnaireApprovals, error: fetchError } = await supabase
    .from('questionnaire_approvals')
    .select(`
      *,
      product:products (
        name,
        description
      )
    `)
    .order('created_at', { ascending: false })

  if (fetchError) {
    console.error('Error fetching questionnaire approvals:', fetchError)
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Questionnaires</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          There was an error loading your questionnaire submissions. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Questionnaires</h1>
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
        <QuestionnairesList approvals={questionnaireApprovals || []} />
      </Suspense>
    </div>
  )
} 