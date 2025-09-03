'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/lib/auth'

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (userInfo: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // 컴포넌트 마운트 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsLoggedIn(true)
      } catch (error) {
        console.error('Error parsing stored user data:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  const login = (userInfo: User) => {
    setUser(userInfo)
    setIsLoggedIn(true)
    // localStorage에 사용자 정보 저장
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    // localStorage에서 사용자 정보 제거
    localStorage.removeItem('user')
  }

  const value = {
    user,
    isLoggedIn,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}