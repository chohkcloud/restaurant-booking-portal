'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import CategoryGrid from './CategoryGrid'
import RestaurantCard from './RestaurantCard'
import LoginModal from '@/components/auth/LoginModal'
import { getCategories, getFeaturedRestaurants } from '@/lib/restaurants'
import { useAuth } from '@/contexts/AuthContext'
import type { User } from '@/lib/auth' // User 타입 import 추가
import type { Category, Restaurant } from '@/types/restaurant'

const HomePage = () => {
  const router = useRouter()
  const { user, isLoggedIn, login } = useAuth() // login 함수 추가
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesResult, restaurantsResult] = await Promise.all([
        getCategories(),
        getFeaturedRestaurants()
      ])

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
      }

      if (restaurantsResult.success) {
        setFeaturedRestaurants(restaurantsResult.restaurants)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // 로그인 성공 처리 함수 추가
  const handleLoginSuccess = (userInfo: User) => {
    login(userInfo) // AuthContext의 login 함수 호출하여 상태 업데이트
    setShowLoginModal(false) // 모달 닫기
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff1ee 0%, #ffe4de 100%)'
    }}>
      {/* 헤더 및 검색 바 */}
      <div style={{ 
        background: 'white',
        padding: '1.5rem 1rem',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* 로그인/프로필 버튼 */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '1rem'
          }}>
            {isLoggedIn ? (
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '2rem',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(-2px)'
                  target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(0)'
                  target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
                }}
              >
                <UserCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                {user?.name || '내 정보'}
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '2rem',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(-2px)'
                  target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(0)'
                  target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
                }}
              >
                <UserCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                로그인
              </button>
            )}
          </div>
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            style={{ maxWidth: '600px', margin: '0 auto' }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="음식이나 레스토랑을 검색하세요..."
                style={{
                  width: '100%',
                  padding: '0.875rem 5rem 0.875rem 2.75rem',
                  borderRadius: '2rem',
                  border: '2px solid #ff6b35',
                  background: 'white',
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  zIndex: 1,
                  lineHeight: '1.5'
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement
                  target.style.transform = 'translateY(-2px)'
                  target.style.boxShadow = '0 12px 35px rgba(255, 107, 53, 0.2)'
                  target.style.borderColor = 'rgba(255,255,255,0.5)'
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement
                  target.style.transform = 'translateY(0)'
                  target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
                  target.style.borderColor = 'rgba(255,255,255,0.3)'
                }}
              />
              <MagnifyingGlassIcon 
                style={{ 
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#9CA3AF'
                }} 
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '0.375rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '1.5rem',
                  border: 'none',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
                  transition: 'all 0.2s ease',
                  zIndex: 2,
                  height: 'calc(100% - 0.75rem)'
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(-50%) scale(1.05)'
                  target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLButtonElement
                  target.style.transform = 'translateY(-50%) scale(1)'
                  target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
                }}
              >
                검색
              </button>
            </div>
          </motion.form>

          {/* 현재 위치 표시 */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginTop: '0.75rem',
            fontSize: '0.875rem',
            color: '#6B7280'
          }}>
            <svg 
              style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>현재 위치: 서울특별시</span>
          </div>

        </div>
      </div>

      {/* 카테고리 섹션 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: '3rem 0'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '3px solid #ffe4de',
                borderTop: '3px solid #ff6b35',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style jsx>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
          </motion.div>
        </div>
      </div>

      {/* 추천 레스토랑 섹션 */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '1.5rem'
          }}>
            <h2 style={{ 
              fontSize: '1.875rem', 
              fontWeight: 'bold', 
              color: '#ff6b35',
              textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)'
            }}>
              ⭐ 추천 맛집
            </h2>
            <button
              onClick={() => router.push('/restaurants')}
              style={{
                color: '#ff6b35',
                fontWeight: '600',
                fontSize: '0.875rem',
                background: 'rgba(255, 107, 53, 0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(255, 107, 53, 0.2)'
                target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(255, 107, 53, 0.1)'
                target.style.transform = 'translateY(0)'
              }}
            >
              전체보기 →
            </button>
          </div>
          
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              padding: '3rem 0'
            }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                border: '3px solid #ffe4de',
                borderTop: '3px solid #ff6b35',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '1.5rem' 
            }}>
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* 푸터 */}
      <footer style={{ 
        background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
        color: 'white',
        padding: '2rem 0',
        marginTop: '3rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ 
            fontSize: '0.875rem', 
            opacity: 0.9,
            textShadow: '0 1px 2px rgba(0,0,0,0.1)'
          }}>
            © 2025 맛집 예약 포털. All rights reserved.
          </p>
          <p style={{ 
            fontSize: '0.75rem', 
            opacity: 0.7,
            marginTop: '0.5rem'
          }}>
            🍽️ 맛있는 식사와 즐거운 시간을 함께하세요
          </p>
        </div>
      </footer>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLoginSuccess} // 수정: AuthContext와 연동되는 함수로 변경
      />
    </div>
  )
}

export default HomePage