'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface QuestionnaireApprovalActionsProps {
  approvalId: string
}

export function QuestionnaireApprovalActions({ approvalId }: QuestionnaireApprovalActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleApproval(status: 'approved' | 'rejected') {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/approve-questionnaire', {
        method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ approvalId, status })
      })
      if (!res.ok) {
         throw new Error('Failed to update questionnaire status')
      }
      // Refresh the page (or revalidate) so that the list is updated.
       router.refresh()
    } catch (err) {
       console.error(err)
       alert('An error occurred. (Please try again.)')
    } finally { setIsLoading(false) }
  }

  return (
    <div className="flex gap-2">
      <button
         disabled={isLoading}
         onClick={() => handleApproval('approved')}
         className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
      >
         Approve
      </button>
      <button
         disabled={isLoading}
         onClick={() => handleApproval('rejected')}
         className="px-2 py 1 bg-red-600 text-white rounded hover:bg–red-700 disabled:opacity–50"
      >
         Reject
      </button>
    </div>
  )
} 