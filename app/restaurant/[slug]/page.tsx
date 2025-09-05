'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  HeartIcon,
  ShareIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { getRestaurantBySlug, getRestaurantMenus } from '@/lib/restaurants'
import { getReviews } from '@/lib/reviews'
import { useAuth } from '@/contexts/AuthContext'
import LoginModal from '@/components/auth/LoginModal'
import ReviewModal from '@/components/reviews/ReviewModal'
import ReservationSection from '@/components/dashboard/ReservationSection'
import type { Restaurant, RestaurantMenu } from '@/types/restaurant'
import type { Review } from '@/lib/reviews'

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { user, isLoggedIn } = useAuth()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menus, setMenus] = useState<RestaurantMenu[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'menu' | 'review' | 'info'>('menu')
  

  // 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'reservation' | 'review' | null>(null)

  useEffect(() => {
    loadData()
  }, [slug])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // 레스토랑 정보 로드
      const restaurantResult = await getRestaurantBySlug(slug)
      if (restaurantResult.success && restaurantResult.restaurant) {
        setRestaurant(restaurantResult.restaurant)
        
        // 메뉴 로드
        const menuResult = await getRestaurantMenus(restaurantResult.restaurant.id)
        if (menuResult.success) {
          setMenus(menuResult.menus)
        }
        
        // 리뷰 로드
        const reviewResult = await getReviews({
          restaurant_name: restaurantResult.restaurant.name,
          limit: 10
        })
        if (reviewResult.success) {
          setReviews(reviewResult.reviews || [])
        }
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-gray-500 text-lg mb-4">레스토랑을 찾을 수 없습니다.</p>
        <button
          onClick={() => router.push('/restaurants')}
          className="text-orange-500 hover:text-orange-600 font-semibold"
        >
          레스토랑 목록으로 돌아가기
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff1ee 0%, #ffe4de 100%)'
    }}>
      {/* 헤더 이미지 */}
      <div className="relative h-32 md:h-40 bg-gray-200 overflow-hidden">
        {restaurant.image_url ? (
          <>
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            {/* 이미지 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-black/10"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-white text-6xl drop-shadow-lg">🍽️</span>
          </div>
        )}
        
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            padding: '0.75rem',
            borderRadius: '50%',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement
            target.style.background = 'white'
            target.style.transform = 'scale(1.1)'
            target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement
            target.style.background = 'rgba(255,255,255,0.95)'
            target.style.transform = 'scale(1)'
            target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          <ArrowLeftIcon style={{ width: '1.25rem', height: '1.25rem', color: '#374151' }} />
        </button>

        {/* 공유/좋아요 버튼 */}
        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
          <button
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              padding: '0.75rem',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.background = 'white'
              target.style.transform = 'scale(1.1)'
              target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.background = 'rgba(255,255,255,0.95)'
              target.style.transform = 'scale(1)'
              target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <HeartIcon style={{ width: '1.25rem', height: '1.25rem', color: '#EF4444' }} />
          </button>
          <button
            style={{
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(10px)',
              padding: '0.75rem',
              borderRadius: '50%',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.background = 'white'
              target.style.transform = 'scale(1.1)'
              target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.background = 'rgba(255,255,255,0.95)'
              target.style.transform = 'scale(1)'
              target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <ShareIcon style={{ width: '1.25rem', height: '1.25rem', color: '#3B82F6' }} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-6">
        <div style={{
          background: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
          border: '2px solid #ff6b35',
          padding: '2rem'
        }}>
          {/* 레스토랑 정보 */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '2rem' }}>
              <div style={{ flex: 1 }}>
                <h1 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: '#ff6b35',
                  marginBottom: '1rem',
                  textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)',
                  lineHeight: 1.2
                }}>
                  {restaurant.name}
                </h1>
                
                {restaurant.description && (
                  <p style={{ 
                    fontSize: '1.125rem',
                    color: '#6B7280', 
                    marginBottom: '1.5rem',
                    lineHeight: 1.6,
                    maxWidth: '600px'
                  }}>
                    {restaurant.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.875rem' }}>
                  {/* 평점 */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    boxShadow: '0 2px 8px rgba(251, 191, 36, 0.2)'
                  }}>
                    <StarIconSolid style={{ width: '1.25rem', height: '1.25rem', color: '#F59E0B', marginRight: '0.5rem' }} />
                    <span style={{ fontWeight: '600', color: '#92400E' }}>{restaurant.rating.toFixed(1)}</span>
                    <span style={{ color: '#78716C', marginLeft: '0.25rem' }}>({restaurant.total_reviews}개 리뷰)</span>
                  </div>
                  
                  {/* 카테고리 */}
                  {restaurant.category && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                    }}>
                      <span style={{ marginRight: '0.5rem', fontSize: '1.125rem' }}>{restaurant.category.icon}</span>
                      <span style={{ fontWeight: '500', color: '#1E40AF' }}>{restaurant.category.name}</span>
                    </div>
                  )}
                  
                  {/* 가격대 */}
                  {restaurant.price_range && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                    }}>
                      <span style={{ fontWeight: '600', color: '#065F46', fontSize: '1rem' }}>
                        {restaurant.price_range.replace(/\$/g, '₩')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 예약 버튼 */}
              <button
                onClick={() => {
                  router.push(`/reservation?restaurant=${slug}`)
                }}
                style={{
                  background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '1rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
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
                <CalendarIcon className="w-5 h-5" />
                예약하기
              </button>
            </div>
          </div>


          {/* 탭 메뉴 */}
          <div style={{
            borderTop: '1px solid #E5E7EB',
            paddingTop: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
              {(['menu', 'review', 'info'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '2rem',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    border: activeTab === tab ? '2px solid #ff6b35' : '2px solid #E5E7EB',
                    background: activeTab === tab 
                      ? 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)'
                      : 'white',
                    color: activeTab === tab ? 'white' : '#6B7280',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activeTab === tab 
                      ? '0 4px 15px rgba(255, 107, 53, 0.3)'
                      : '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== tab) {
                      const target = e.target as HTMLButtonElement
                      target.style.borderColor = '#ff6b35'
                      target.style.color = '#ff6b35'
                      target.style.transform = 'translateY(-2px)'
                      target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.2)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== tab) {
                      const target = e.target as HTMLButtonElement
                      target.style.borderColor = '#E5E7EB'
                      target.style.color = '#6B7280'
                      target.style.transform = 'translateY(0)'
                      target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {tab === 'menu' && '🍽️ 메뉴'}
                  {tab === 'review' && '⭐ 리뷰'}
                  {tab === 'info' && '📍 매장정보'}
                </button>
              ))}
            </div>

            {/* 메뉴 탭 */}
            {activeTab === 'menu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <div key={menu.id} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.5rem',
                      padding: '1.5rem',
                      background: 'linear-gradient(135deg, #FEFEFE 0%, #F9FAFB 100%)',
                      borderRadius: '1.25rem',
                      border: '1px solid #F3F4F6',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                      transition: 'all 0.2s ease'
                    }}>
                      {menu.image_url && (
                        <img
                          src={menu.image_url}
                          alt={menu.name}
                          style={{
                            width: '6rem',
                            height: '6rem',
                            objectFit: 'cover',
                            borderRadius: '1rem',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                          }}
                        />
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <div>
                            <h3 style={{
                              fontWeight: '600',
                              color: '#1F2937',
                              fontSize: '1.125rem',
                              marginBottom: '0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem'
                            }}>
                              {menu.name}
                              {menu.is_popular && (
                                <span style={{
                                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                                  color: '#92400E',
                                  fontSize: '0.75rem',
                                  padding: '0.25rem 0.75rem',
                                  borderRadius: '1rem',
                                  fontWeight: '700',
                                  boxShadow: '0 2px 4px rgba(251, 191, 36, 0.2)'
                                }}>
                                  🔥 인기
                                </span>
                              )}
                            </h3>
                            {menu.description && (
                              <p style={{
                                fontSize: '0.9rem',
                                color: '#6B7280',
                                lineHeight: 1.5,
                                marginTop: '0.25rem'
                              }}>
                                {menu.description}
                              </p>
                            )}
                          </div>
                          <span style={{
                            fontWeight: '700',
                            fontSize: '1.25rem',
                            background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            color: '#ff6b35'
                          }}>
                            ₩{menu.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#9CA3AF',
                    fontSize: '1.125rem'
                  }}>
                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🍽️</span>
                    메뉴 정보가 없습니다.
                  </div>
                )}
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === 'review' && (
              <div>
                <button
                  onClick={() => {
                    if (!isLoggedIn) {
                      setPendingAction('review')
                      setShowLoginModal(true)
                    } else {
                      setShowReviewModal(true)
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '1rem',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
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
                  ✨ 리뷰 작성하기
                </button>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(135deg, #FEFEFE 0%, #F9FAFB 100%)',
                        borderRadius: '1.25rem',
                        border: '1px solid #F3F4F6',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                          <div>
                            <span style={{ fontWeight: '600', color: '#1F2937', fontSize: '1.1rem' }}>
                              {review.users?.name || '익명'}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.5rem', gap: '0.5rem' }}>
                              <div style={{ display: 'flex' }}>
                                {[1,2,3,4,5].map(star => (
                                  <StarIconSolid 
                                    key={star} 
                                    style={{
                                      width: '1.125rem',
                                      height: '1.125rem',
                                      color: star <= Math.round(review.rating_average) 
                                        ? '#F59E0B' 
                                        : '#D1D5DB'
                                    }}
                                  />
                                ))}
                              </div>
                              <span style={{
                                fontSize: '0.85rem',
                                color: '#9CA3AF',
                                background: '#F3F4F6',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '0.5rem'
                              }}>
                                {new Date(review.created_at).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <h4 style={{
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            color: '#374151',
                            fontSize: '1.05rem'
                          }}>
                            {review.title}
                          </h4>
                        )}
                        <p style={{
                          color: '#4B5563',
                          lineHeight: 1.6,
                          fontSize: '0.95rem'
                        }}>
                          {review.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '3rem',
                      color: '#9CA3AF',
                      fontSize: '1.125rem'
                    }}>
                      <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>⭐</span>
                      아직 리뷰가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 매장정보 탭 */}
            {activeTab === 'info' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {restaurant.address && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #FEFEFE 0%, #F9FAFB 100%)',
                    borderRadius: '1rem',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
                    }}>
                      <MapPinIcon style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '1.1rem', marginBottom: '0.5rem' }}>주소</p>
                      <p style={{ color: '#6B7280', lineHeight: 1.5 }}>{restaurant.address}</p>
                    </div>
                  </div>
                )}
                
                {restaurant.phone && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #FEFEFE 0%, #F9FAFB 100%)',
                    borderRadius: '1rem',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                    }}>
                      <PhoneIcon style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '1.1rem', marginBottom: '0.5rem' }}>전화번호</p>
                      <p style={{ color: '#6B7280', lineHeight: 1.5 }}>{restaurant.phone}</p>
                    </div>
                  </div>
                )}
                
                {restaurant.opening_hours && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(135deg, #FEFEFE 0%, #F9FAFB 100%)',
                    borderRadius: '1rem',
                    border: '1px solid #F3F4F6',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
                      padding: '0.75rem',
                      borderRadius: '0.75rem',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
                    }}>
                      <ClockIcon style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1F2937', fontSize: '1.1rem', marginBottom: '0.5rem' }}>영업시간</p>
                      <p style={{ color: '#6B7280', lineHeight: 1.5 }}>매일 11:00 - 22:00</p>
                    </div>
                  </div>
                )}
                
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #FEFEFE 0%, #F9FAFB 100%)',
                  borderRadius: '1rem',
                  border: '1px solid #F3F4F6',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <p style={{ 
                    fontWeight: '600', 
                    color: '#1F2937', 
                    fontSize: '1.1rem', 
                    marginBottom: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    🏢 편의시설
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <span style={{
                      background: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)',
                      color: '#1E40AF',
                      padding: '0.5rem 1rem',
                      borderRadius: '1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
                    }}>
                      🚗 주차가능
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                      color: '#065F46',
                      padding: '0.5rem 1rem',
                      borderRadius: '1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)'
                    }}>
                      📶 와이파이
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                      color: '#92400E',
                      padding: '0.5rem 1rem',
                      borderRadius: '1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(251, 191, 36, 0.1)'
                    }}>
                      👥 단체석
                    </span>
                    <span style={{
                      background: 'linear-gradient(135deg, #FFE4E1 0%, #FFCCCB 100%)',
                      color: '#B91C1C',
                      padding: '0.5rem 1rem',
                      borderRadius: '1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)'
                    }}>
                      📅 예약가능
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false)
          setPendingAction(null)
        }}
        onLogin={() => {
          setShowLoginModal(false)
          // 로그인 후 대기 중이던 작업 실행
          if (pendingAction === 'review') {
            setShowReviewModal(true)
          }
          setPendingAction(null)
        }}
      />

      {/* 리뷰 모달 */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        userId={user?.id || ''}
        userName={user?.name}
        restaurantName={restaurant.name}
        onSuccess={() => {
          loadData()
          setShowReviewModal(false)
        }}
      />

    </div>
  )
}