'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import bcrypt from 'bcryptjs'

export interface Admin {
  id: string
  email: string
  name: string
  role: 'admin' | 'super_admin'
  isActive: boolean
}

interface AdminAuthContextType {
  admin: Admin | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 컴포넌트 마운트 시 localStorage에서 관리자 정보 복원
  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin')
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin)
        setAdmin(parsedAdmin)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Error parsing stored admin data:', error)
        localStorage.removeItem('admin')
      }
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '로그인에 실패했습니다')
        return false
      }

      const adminInfo: Admin = {
        id: data.admin.id,
        email: data.admin.email,
        name: data.admin.name,
        role: data.admin.role,
        isActive: data.admin.is_active
      }

      setAdmin(adminInfo)
      setIsLoggedIn(true)
      localStorage.setItem('admin', JSON.stringify(adminInfo))
      localStorage.setItem('adminToken', data.token)
      
      return true
    } catch (error) {
      console.error('Admin login error:', error)
      setError('로그인 중 오류가 발생했습니다')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setAdmin(null)
    setIsLoggedIn(false)
    setError(null)
    localStorage.removeItem('admin')
    localStorage.removeItem('adminToken')
  }

  const value = {
    admin,
    isLoggedIn,
    login,
    logout,
    isLoading,
    error
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}