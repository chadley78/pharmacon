import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

type QuestionnaireApproval = {
  id: string
  created_at: string
  status: 'pending_approval' | 'approved' | 'rejected'
  questionnaire_answers: Record<string, any>
  product: {
    name: string
    description: string
  }
}

export default async function QuestionnairesPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect('/login')
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

  if (!questionnaireApprovals || questionnaireApprovals.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Questionnaires</h1>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
          You haven&apos;t submitted any questionnaires yet.
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Questionnaires</h1>
      
      <div className="space-y-4">
        {questionnaireApprovals.map((approval: QuestionnaireApproval) => (
          <div key={approval.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-lg font-semibold">{approval.product?.name || 'Unknown Product'}</h2>
                <p className="text-sm text-gray-500">
                  Submitted on {new Date(approval.created_at).toLocaleDateString('en-IE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div>
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                  approval.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : approval.status === 'pending_approval'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {approval.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {approval.questionnaire_answers && (
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Your Answers</h3>
                <dl className="space-y-2">
                  {Object.entries(approval.questionnaire_answers).map(([question, answer]) => (
                    <div key={question} className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">{question}</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{String(answer)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 