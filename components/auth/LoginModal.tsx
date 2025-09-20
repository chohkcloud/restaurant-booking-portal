'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, EnvelopeIcon, PhoneIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { registerUser, loginUser, RegisterData, LoginData, User } from '@/lib/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (userInfo: User) => void
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      if (isLoginMode) {
        // 로그인 처리
        const loginData: LoginData = {
          email: formData.email,
          password: formData.password
        }
        
        const result = await loginUser(loginData)
        
        if (result.success && result.user) {
          onLogin(result.user)
          onClose()
          // 폼 초기화
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: ''
          })
        } else {
          setSubmitError(result.message)
        }
      } else {
        // 회원가입 처리
        const registerData: RegisterData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        }
        
        const result = await registerUser(registerData)
        
        if (result.success && result.user) {
          // 회원가입 성공 시 자동 로그인
          onLogin(result.user)
          onClose()
          alert('회원가입이 완료되었습니다!')
          // 폼 초기화
          setFormData({
            name: '',
            email: '',
            phone: '',
            password: ''
          })
        } else {
          setSubmitError(result.message)
        }
      }
    } catch (error) {
      console.error('폼 제출 오류:', error)
      setSubmitError('처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
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

    // 제출 에러도 초기화
    if (submitError) {
      setSubmitError('')
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
          background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
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
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
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
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
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
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
              onBlur={(e) => e.target.style.borderColor = errors.password ? '#ef4444' : '#e5e5e5'}
              placeholder={isLoginMode ? '비밀번호를 입력하세요' : '6자 이상 입력하세요'}
            />
            {errors.password && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* 전역 에러 메시지 */}
          {submitError && (
            <div style={{
              padding: '0.75rem',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '0.5rem',
              color: '#dc2626',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {submitError}
            </div>
          )}

          {/* 버튼들 */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: isSubmitting 
                ? '#ccc' 
                : 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}>
            {isSubmitting 
              ? (isLoginMode ? '로그인 중...' : '회원가입 중...')
              : (isLoginMode ? '로그인' : '회원가입')
            }
          </button>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              style={{
                background: 'none',
                border: 'none',
                color: '#22c55e',
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