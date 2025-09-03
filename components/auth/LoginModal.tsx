'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, EnvelopeIcon, PhoneIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (userInfo: UserInfo) => void
}

export interface UserInfo {
  name: string
  email: string
  phone: string
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  })

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      password: ''
    }

    if (!isLoginMode && !formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요'
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요'
    }

    if (!isLoginMode && !formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요'
    } else if (!isLoginMode && !/^01[0-9]-?[0-9]{4}-?[0-9]{4}$/.test(formData.phone.replace(/-/g, ''))) {
      newErrors.phone = '올바른 전화번호 형식을 입력해주세요 (010-0000-0000)'
    }

    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요'
    } else if (!isLoginMode && formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error !== '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    // 실제 서비스에서는 API 호출을 통한 인증이 필요
    // 여기서는 간단한 데모용 로직
    const userInfo: UserInfo = {
      name: formData.name || '고객님',
      email: formData.email,
      phone: formData.phone || '010-0000-0000'
    }

    onLogin(userInfo)
    onClose()
    
    // 폼 초기화
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: ''
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 에러 초기화
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}
    onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          background: 'white',
          borderRadius: '1rem',
          maxWidth: '400px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
        }}
        onClick={(e) => e.stopPropagation()}>
        
        {/* 헤더 */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
          padding: '1.5rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {isLoginMode ? '로그인' : '회원가입'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}>
            <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem' }}>
          {/* 이름 (회원가입 시에만) */}
          {!isLoginMode && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600', 
                color: '#333' 
              }}>
                <UserIcon style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${errors.name ? '#ef4444' : '#e5e5e5'}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : '#e5e5e5'}
                placeholder="이름을 입력하세요"
              />
              {errors.name && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.name}
                </p>
              )}
            </div>
          )}

          {/* 이메일 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              <EnvelopeIcon style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
              이메일
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.email ? '#ef4444' : '#e5e5e5'}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = errors.email ? '#ef4444' : '#e5e5e5'}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* 전화번호 (회원가입 시에만) */}
          {!isLoginMode && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600', 
                color: '#333' 
              }}>
                <PhoneIcon style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
                전화번호
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: `2px solid ${errors.phone ? '#ef4444' : '#e5e5e5'}`,
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
                onBlur={(e) => e.target.style.borderColor = errors.phone ? '#ef4444' : '#e5e5e5'}
                placeholder="010-0000-0000"
              />
              {errors.phone && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {errors.phone}
                </p>
              )}
            </div>
          )}

          {/* 비밀번호 */}
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#333' 
            }}>
              <LockClosedIcon style={{ width: '1rem', height: '1rem', display: 'inline', marginRight: '0.5rem' }} />
              비밀번호
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: `2px solid ${errors.password ? '#ef4444' : '#e5e5e5'}`,
                borderRadius: '0.5rem',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff6b35'}
              onBlur={(e) => e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e5e5'}
              placeholder={isLoginMode ? '비밀번호를 입력하세요' : '6자 이상 입력하세요'}
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* 버튼들 */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}>
            {isLoginMode ? '로그인' : '회원가입'}
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff6b35',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.875rem'
              }}>
              {isLoginMode ? '회원가입하기' : '로그인하기'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default LoginModal