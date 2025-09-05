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
import type { ReservationRecord, ReservationInfo } from '@/types/reservation'

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
  
  // 예약 관련 상태
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [partySize, setPartySize] = useState(2)
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [isProcessingReservation, setIsProcessingReservation] = useState(false)
  const [myReservations, setMyReservations] = useState<ReservationRecord[]>([])
  const [lastReservation, setLastReservation] = useState<ReservationInfo | null>(null)
  const [cancellingReservation, setCancellingReservation] = useState<string | null>(null)

  // 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showReviewModal, setShowReviewModal] = useState(false)

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

  const handleReservation = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    
    if (!selectedDate || !selectedTime || !restaurant) {
      alert('날짜와 시간을 선택해주세요.')
      return
    }

    setIsProcessingReservation(true)

    try {
      const { format } = await import('date-fns')
      const { ko } = await import('date-fns/locale')
      const { sendReservationNotifications } = await import('@/lib/notifications')
      const { createReservation } = await import('@/lib/reservations')
      
      const dayName = format(selectedDate, 'EEEE', { locale: ko })
      const formattedDate = format(selectedDate, 'yyyy년 M월 d일', { locale: ko })
      
      const reservationData = {
        customerName: user!.name,
        customerEmail: user!.email,
        customerPhone: user!.phone,
        date: `${formattedDate} (${dayName})`,
        time: selectedTime,
        partySize: partySize,
        restaurantName: restaurant.name
      }

      // DB에 예약 저장
      const reservationResult = await createReservation(user!.id, reservationData, restaurant.id)
      
      if (!reservationResult.success) {
        throw new Error(reservationResult.message)
      }

      // 알림 발송
      const notificationResults = await sendReservationNotifications(
        reservationData, 
        reservationResult.reservation?.id
      )
      
      let message = `${restaurant.name} 예약이 완료되었습니다!`
      if (notificationResults.emailSent) {
        message += '\n📧 이메일로 예약 확정 안내를 발송했습니다.'
      }

      alert(message)
      setShowReservationForm(false)
    } catch (error) {
      console.error('예약 처리 중 오류:', error)
      alert('예약 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessingReservation(false)
    }
  }

  const isTimeSlotBooked = (date: Date, time: string) => {
    // 시간대 중복 체크 로직
    return false
  }

  const handleCancelReservation = async (reservationId: string) => {
    // 예약 취소 로직
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
      <div className="relative h-64 md:h-80 bg-gray-200">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <span className="text-white text-6xl">🍽️</span>
          </div>
        )}
        
        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        {/* 공유/좋아요 버튼 */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
            <HeartIcon className="w-5 h-5" />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors">
            <ShareIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12">
        <div style={{
          background: 'white',
          borderRadius: '1.5rem',
          boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
          border: '2px solid #ff6b35',
          padding: '2rem'
        }}>
          {/* 레스토랑 정보 */}
          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{restaurant.name}</h1>
                <p className="text-gray-600 mb-3">{restaurant.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  {/* 평점 */}
                  <div className="flex items-center">
                    <StarIconSolid className="w-5 h-5 text-yellow-400 mr-1" />
                    <span className="font-semibold">{restaurant.rating.toFixed(1)}</span>
                    <span className="text-gray-500 ml-1">({restaurant.total_reviews}개 리뷰)</span>
                  </div>
                  
                  {/* 카테고리 */}
                  {restaurant.category && (
                    <div className="flex items-center">
                      <span className="mr-1">{restaurant.category.icon}</span>
                      <span>{restaurant.category.name}</span>
                    </div>
                  )}
                  
                  {/* 가격대 */}
                  {restaurant.price_range && (
                    <div className="flex items-center">
                      <span className="font-medium">
                        {restaurant.price_range.replace(/\$/g, '₩')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 예약 버튼 */}
              <button
                onClick={() => setShowReservationForm(!showReservationForm)}
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
                  e.target.style.transform = 'translateY(-2px)'
                  e.target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
                }}
              >
                <CalendarIcon className="w-5 h-5" />
                예약하기
              </button>
            </div>
          </div>

          {/* 예약 폼 */}
          {showReservationForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-t pt-6 mb-6"
            >
              <ReservationSection
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                partySize={partySize}
                setPartySize={setPartySize}
                lastReservation={lastReservation}
                myReservations={myReservations}
                isProcessingReservation={isProcessingReservation}
                isLoggedIn={isLoggedIn}
                handleReservation={handleReservation}
                isTimeSlotBooked={isTimeSlotBooked}
                showReservationForm={true}
                setShowReservationForm={setShowReservationForm}
                handleCancelReservation={handleCancelReservation}
                cancellingReservation={cancellingReservation}
              />
            </motion.div>
          )}

          {/* 탭 메뉴 */}
          <div className="border-t pt-6">
            <div className="flex gap-6 mb-6">
              {(['menu', 'review', 'info'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2 font-semibold transition-colors ${
                    activeTab === tab
                      ? 'text-orange-500 border-b-2 border-orange-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'menu' && '메뉴'}
                  {tab === 'review' && '리뷰'}
                  {tab === 'info' && '매장정보'}
                </button>
              ))}
            </div>

            {/* 메뉴 탭 */}
            {activeTab === 'menu' && (
              <div className="space-y-4">
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <div key={menu.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      {menu.image_url && (
                        <img
                          src={menu.image_url}
                          alt={menu.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {menu.name}
                              {menu.is_popular && (
                                <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
                                  인기
                                </span>
                              )}
                            </h3>
                            {menu.description && (
                              <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
                            )}
                          </div>
                          <span className="font-bold text-lg text-orange-500">
                            ₩{menu.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">메뉴 정보가 없습니다.</p>
                )}
              </div>
            )}

            {/* 리뷰 탭 */}
            {activeTab === 'review' && (
              <div>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="mb-6 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  리뷰 작성하기
                </button>
                
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className="font-semibold">{review.users?.name || '익명'}</span>
                            <div className="flex items-center mt-1">
                              {[1,2,3,4,5].map(star => (
                                <StarIconSolid 
                                  key={star} 
                                  className={`w-4 h-4 ${
                                    star <= Math.round(review.rating_average) 
                                      ? 'text-yellow-400' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-500">
                                {new Date(review.created_at).toLocaleDateString('ko-KR')}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <h4 className="font-semibold mb-1">{review.title}</h4>
                        )}
                        <p className="text-gray-700">{review.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">아직 리뷰가 없습니다.</p>
                  )}
                </div>
              </div>
            )}

            {/* 매장정보 탭 */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                {restaurant.address && (
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">주소</p>
                      <p className="text-gray-600">{restaurant.address}</p>
                    </div>
                  </div>
                )}
                
                {restaurant.phone && (
                  <div className="flex items-start gap-3">
                    <PhoneIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">전화번호</p>
                      <p className="text-gray-600">{restaurant.phone}</p>
                    </div>
                  </div>
                )}
                
                {restaurant.opening_hours && (
                  <div className="flex items-start gap-3">
                    <ClockIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-700">영업시간</p>
                      <p className="text-gray-600">매일 11:00 - 22:00</p>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t">
                  <p className="font-semibold text-gray-700 mb-2">편의시설</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">주차가능</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">와이파이</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">단체석</span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">예약가능</span>
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
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {}}
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