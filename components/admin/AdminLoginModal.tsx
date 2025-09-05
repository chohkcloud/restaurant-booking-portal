'use client'

import React, { useState } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AdminLoginModal({ isOpen, onClose, onSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading, error } = useAdminAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await login(email, password)
    if (success) {
      setEmail('')
      setPassword('')
      onClose()
      onSuccess?.()
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="관리자 로그인">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            type="email"
            placeholder="관리자 이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !email || !password}
            className="flex-1"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </div>
      </form>

      <div className="mt-4 p-3 bg-gray-50 rounded text-sm text-gray-600">
        <p><strong>기본 관리자 계정:</strong></p>
        <p>이메일: admin@restaurant.com</p>
        <p>비밀번호: admin123!</p>
      </div>
    </Modal>
  )
}