async function deleteAllQuestionnaireApprovals() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/delete-all-questionnaire-approvals', {
      method: 'POST',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete questionnaire approvals')
    }

    console.log('Success:', data.message)
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'An unexpected error occurred')
    process.exit(1)
  }
}

deleteAllQuestionnaireApprovals() 