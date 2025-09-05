import jwt from 'jsonwebtoken'

export interface AdminTokenPayload {
  id: string
  email: string
  role: 'admin' | 'super_admin'
  type: 'admin'
}

export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AdminTokenPayload
    
    if (decoded.type !== 'admin') {
      return null
    }
    
    return decoded
  } catch (error) {
    console.error('Admin token verification failed:', error)
    return null
  }
}

export function getAuthHeaders() {
  const token = localStorage.getItem('adminToken')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}