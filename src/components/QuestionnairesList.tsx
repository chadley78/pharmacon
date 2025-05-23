'use client'

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

export function QuestionnairesList({ approvals }: { approvals: QuestionnaireApproval[] }) {
  if (!approvals || approvals.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-500">
        You haven&apos;t submitted any questionnaires yet.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => (
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
            <div className="flex items-center gap-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                approval.status === 'approved' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                }`}
              >
                {approval.status === 'approved' ? 'Approved' : 'Rejected'}
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
  )
} 