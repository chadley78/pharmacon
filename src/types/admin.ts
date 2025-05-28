export interface AdminUser {
  id: string
  user_id: string
  role: 'admin' | 'super_admin'
  created_at: string
  can_add_admins: boolean
  can_delete_admins: boolean
  user: {
    email: string
  }
} 