import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { createAdminClient } from '@/lib/supabase/admin'
import { QuestionnaireApprovalActions } from './QuestionnaireApprovalActions'

interface QuestionnaireApproval {
  id: string
  created_at: string
  status: 'pending_approval' | 'approved' | 'rejected'
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

      {questionnaireApprovals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-600">No questionnaire submissions to review.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questionnaireApprovals.map((approval) => (
            <div
              key={approval.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {approval.product.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted by (user_id: {approval.user_id}) on {format(new Date(approval.created_at), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      approval.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : approval.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {approval.status === 'pending_approval'
                      ? 'Pending Review'
                      : approval.status === 'approved'
                      ? 'Approved'
                      : 'Rejected'}
                  </span>
                  {approval.status === 'pending_approval' && (
                    <QuestionnaireApprovalActions approvalId={approval.id} />
                  )}
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Questionnaire Answers:</h4>
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Over 18 years of age:</dt>
                    <dd className="font-medium text-gray-900">
                      {approval.questionnaire_answers.over18 ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">No heart problems:</dt>
                    <dd className="font-medium text-gray-900">
                      {approval.questionnaire_answers.noHeartProblems ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">No nitrate medications:</dt>
                    <dd className="font-medium text-gray-900">
                      {approval.questionnaire_answers.noNitrates ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">No liver problems:</dt>
                    <dd className="font-medium text-gray-900">
                      {approval.questionnaire_answers.noLiverProblems ? 'Yes' : 'No'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">No recent stroke/heart attack:</dt>
                    <dd className="font-medium text-gray-900">
                      {approval.questionnaire_answers.noRecentStroke ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 