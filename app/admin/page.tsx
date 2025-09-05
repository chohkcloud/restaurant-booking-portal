'use client'

import React, { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import AdminLoginModal from '@/components/admin/AdminLoginModal'
import AdminDashboard from '@/components/admin/AdminDashboard'
import Button from '@/components/ui/Button'

export default function AdminPage() {
  const { admin, isLoggedIn, logout } = useAdminAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🏪 식당 관리자 페이지
            </h2>
            <p className="text-gray-600 mb-8">
              관리자 권한으로 로그인하여 식당을 관리하세요.
            </p>
            
            <Button
              onClick={() => setShowLoginModal(true)}
              className="w-full"
            >
              관리자 로그인
            </Button>
          </div>
        </div>

        <AdminLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🏪 식당 관리 시스템
              </h1>
              <p className="text-sm text-gray-500">
                안녕하세요, {admin?.name}님 ({admin?.role})
              </p>
            </div>
            
            <Button
              onClick={logout}
              variant="secondary"
              size="sm"
            >
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main>
        <AdminDashboard />
      </main>
    </div>
  )
}