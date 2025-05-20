import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import ConsultationRequestForm from '@/components/forms/ConsultationRequestForm'

interface ConsultationPageProps {
  params: Promise<{
    productId: string
  }>
}

export default async function ConsultationPage({ params }: ConsultationPageProps) {
  const { productId } = await params
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login?redirect=/consultations/' + productId)
  }

  // Get product details
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('category', 'doctor_consultation')
    .eq('is_active', true)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Request a Consultation
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          {product.name}
        </p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
        <div className="px-4 py-6 sm:p-8">
          <ConsultationRequestForm product={product} />
        </div>
      </div>
    </div>
  )
} 