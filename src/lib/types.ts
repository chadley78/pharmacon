export type ProductCategory = 'direct_purchase' | 'prescription' | 'restricted'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  image_url: string | null
  category: ProductCategory
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  questionnaire_approval_id?: string | null
  created_at: string
  updated_at: string
  product?: Product
  dosage?: number
  tablet_count?: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

export enum OrderStatus {
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface Address {
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  postal_code: string
  country: string
  phone?: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price_at_time: number
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  shipping_address: Address
  billing_address: Address
  subtotal: number
  shipping_cost: number
  total: number
  stripe_payment_intent_id: string
  stripe_customer_id?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
} 