'use client'

import { format } from 'date-fns'
import { QuestionnaireApprovalActions } from '@/app/(admin)/admin/questionnaires/QuestionnaireApprovalActions'

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

export function QuestionnaireApprovalsList({ approvals }: { approvals: QuestionnaireApproval[] }) {
  if (!approvals || approvals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
        <p className="text-gray-600">No questionnaire submissions to review.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => (
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
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {approval.status === 'approved' ? 'Approved' : 'Rejected'}
              </span>
              {approval.status === 'approved' && (
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
  )
} 