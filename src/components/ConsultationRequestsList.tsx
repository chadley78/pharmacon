import { format } from 'date-fns'

interface Product {
  name: string
  description: string
  price: number
}

interface ConsultationRequest {
  id: string
  status: 'submitted' | 'pending' | 'approved' | 'rejected' | 'completed'
  customer_details: {
    fullName: string
    email: string
    phone: string
    reason: string
    preferredDate: string
    preferredTime: string
  }
  created_at: string
  products: Product
}

interface ConsultationRequestsListProps {
  requests: ConsultationRequest[]
}

const statusColors = {
  submitted: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  completed: 'bg-gray-100 text-gray-800'
}

export function ConsultationRequestsList({ requests }: ConsultationRequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">You haven&apos;t submitted any consultation requests yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold">{request.products.name}</h2>
              <p className="text-gray-600 text-sm">
                Requested on {format(new Date(request.created_at), 'PPP')}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status]}`}>
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
              <dl className="space-y-1 text-sm text-gray-600">
                <div>
                  <dt className="inline font-medium">Name:</dt>
                  <dd className="inline ml-1">{request.customer_details.fullName}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Email:</dt>
                  <dd className="inline ml-1">{request.customer_details.email}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Phone:</dt>
                  <dd className="inline ml-1">{request.customer_details.phone}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Consultation Details</h3>
              <dl className="space-y-1 text-sm text-gray-600">
                <div>
                  <dt className="inline font-medium">Preferred Date:</dt>
                  <dd className="inline ml-1">{format(new Date(request.customer_details.preferredDate), 'PPP')}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Preferred Time:</dt>
                  <dd className="inline ml-1">{request.customer_details.preferredTime}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Reason:</dt>
                  <dd className="inline ml-1">{request.customer_details.reason}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 