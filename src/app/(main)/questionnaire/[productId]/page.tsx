import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import QuestionnaireForm from '@/components/forms/QuestionnaireForm'
import { QuestionnaireAnswers } from '@/app/(main)/products/[slug]/ProductDetails'

interface QuestionnairePageProps {
  params: {
    productId: string
  }
}

export default async function QuestionnairePage({ params }: QuestionnairePageProps) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    redirect(`/login?redirect=/questionnaire/${params.productId}`)
  }

  // Fetch product details
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.productId)
    .single()

  if (productError || !product) {
    redirect('/products')
  }

  // Verify this is a questionnaire product
  if (product.category !== 'questionnaire_prescription') {
    redirect(`/products/${product.slug}`)
  }

  async function handleSubmit(data: { answers: QuestionnaireAnswers; productId: string }) {
    'use server'
    
    const response = await fetch('/api/submit-questionnaire', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Failed to submit questionnaire')
    }

    const result = await response.json()
    
    if (result.status === 'approved') {
      redirect(`/products/${product.slug}`)
    } else {
      throw new Error('Questionnaire was not approved')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Medical Questionnaire</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
        <p className="text-gray-600 mb-6">{product.description}</p>
        <QuestionnaireForm 
          productId={params.productId} 
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
} 