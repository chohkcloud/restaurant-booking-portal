'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarIcon,
  CameraIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  TicketIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid, HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '@/contexts/AuthContext'
import LoginModal from '@/components/auth/LoginModal'
import ReviewModal from '@/components/reviews/ReviewModal'
import { sendReservationNotifications, ReservationData } from '@/lib/notifications'
import { getReviews, getReviewStatistics, deleteReview, type Review } from '@/lib/reviews'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import ReservationSection from './ReservationSection'
import type { ReservationInfo, ReservationRecord } from '@/types/reservation'

const CustomerPortal = () => {
  const { user, isLoggedIn, login, logout } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [partySize, setPartySize] = useState(2)
  const [showReservation, setShowReservation] = useState(false) // 예약 섹션 표시 상태
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isProcessingReservation, setIsProcessingReservation] = useState(false)
  const [lastReservation, setLastReservation] = useState<ReservationInfo | null>(null) // 마지막 예약 정보
  const [myReservations, setMyReservations] = useState<ReservationRecord[]>([]) // 내 예약 목록
  const [showReservationForm, setShowReservationForm] = useState(false) // 예약 폼 표시 여부
  const [cancellingReservation, setCancellingReservation] = useState<string | null>(null) // 취소 중인 예약 ID
  const [showReviewModal, setShowReviewModal] = useState(false) // 리뷰 모달 표시 여부
  const [selectedReservationForReview, setSelectedReservationForReview] = useState<string | undefined>(undefined)
  const [reviews, setReviews] = useState<Review[]>([]) // 리뷰 목록
  const [reviewStats, setReviewStats] = useState<{
    total_reviews: number
    avg_rating: number
    avg_taste: number
    avg_service: number
    avg_cleanliness: number
    avg_atmosphere: number
    avg_parking: number
    avg_revisit: number
    recommended_count: number
  } | null>(null) // 리뷰 통계
  // const [myReviews, setMyReviews] = useState<Review[]>([]) // 내 리뷰 목록 - 현재 미사용
  const [editingReview, setEditingReview] = useState<Review | undefined>(undefined)
  
  // 카테고리별 평점 상태 (임시 미리보기용)
  const [categoryRatings, setCategoryRatings] = useState({
    taste: 0,
    service: 0,
    cleanliness: 0,
    atmosphere: 0,
    parking: 0,
    revisit: 0
  })
  const [favorites, setFavorites] = useState(false)
  const [showMenuPopup, setShowMenuPopup] = useState(false)
  
  // 리뷰 목록 불러오기
  const loadReviews = useCallback(async () => {
    try {
      const result = await getReviews({ 
        restaurant_name: '맛집 예약 포털',
        limit: 10,
        sort: 'created_at',
        order: 'desc'
      })
      
      if (result.success) {
        setReviews(result.reviews || [])
        setReviewStats(result.statistics)
        
        // 내 리뷰 필터링 - 현재 미사용
        // if (user) {
        //   const myReviewsList = result.reviews?.filter((r: Review) => r.user_id === user.id) || []
        //   setMyReviews(myReviewsList)
        // }
      }
    } catch (error) {
      console.error('리뷰 목록 로드 실패:', error)
    }
  }, [user])
  
  // 리뷰 통계 불러오기
  const loadReviewStats = useCallback(async () => {
    try {
      const result = await getReviewStatistics('맛집 예약 포털')
      if (result.success) {
        setReviewStats(result.statistics)
      }
    } catch (error) {
      console.error('리뷰 통계 로드 실패:', error)
    }
  }, [])
  
  const loadUserReservations = useCallback(async () => {
    if (!user) return
    
    try {
      const { getUserReservations } = await import('@/lib/reservations')
      const result = await getUserReservations(user.id)
      
      console.log('예약 목록 조회 결과:', result)
      
      if (result.success && result.reservations) {
        // 예약을 날짜 순으로 정렬 (가까운 날짜가 먼저)
        const now = new Date()
        const sortedReservations = result.reservations
          .filter(r => r.status === 'confirmed')
          .map(r => {
            // 날짜 문자열에서 날짜 추출 (예: "2025년 1월 3일 (금요일)" -> Date 객체)
            const dateMatch = r.reservation_date.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/)
            let reservationDateTime = now
            if (dateMatch) {
              const [, year, month, day] = dateMatch
              const [hours, minutes] = r.reservation_time.split(':')
              reservationDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes))
            }
            return { ...r, reservationDateTime }
          })
          // 모든 예약을 표시 (과거 예약도 포함)
          .sort((a, b) => {
            // 미래 예약은 오름차순, 과거 예약은 내림차순
            const aIsFuture = a.reservationDateTime >= now
            const bIsFuture = b.reservationDateTime >= now
            
            if (aIsFuture && bIsFuture) {
              return a.reservationDateTime.getTime() - b.reservationDateTime.getTime()
            } else if (!aIsFuture && !bIsFuture) {
              return b.reservationDateTime.getTime() - a.reservationDateTime.getTime()
            } else {
              return aIsFuture ? -1 : 1
            }
          })
        
        console.log('정렬된 예약 목록:', sortedReservations)
        setMyReservations(sortedReservations)
      }
    } catch (error) {
      console.error('예약 목록 로드 실패:', error)
    }
  }, [user])
  
  // 사용자의 예약 목록 및 리뷰 불러오기
  useEffect(() => {
    if (isLoggedIn && user) {
      console.log('로그인 상태 변경 - 예약 목록 로드', user)
      loadUserReservations()
      loadReviews()
    }
  }, [isLoggedIn, user, loadUserReservations, loadReviews])
  
  // 리뷰 통계 초기 로드
  useEffect(() => {
    loadReviewStats()
    loadReviews()
  }, [loadReviewStats, loadReviews])
  
  // 리뷰 작성 모달 열기
  const handleOpenReviewModal = (reservationId?: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    setSelectedReservationForReview(reservationId)
    setEditingReview(undefined)
    setShowReviewModal(true)
  }
  
  // 리뷰 수정 모달 열기
  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setSelectedReservationForReview(review.reservation_id)
    setShowReviewModal(true)
  }
  
  // 리뷰 삭제
  const handleDeleteReview = async (reviewId: string) => {
    if (!user || !confirm('정말 리뷰를 삭제하시겠습니까?')) return
    
    const result = await deleteReview(reviewId, user.id)
    if (result.success) {
      alert('리뷰가 삭제되었습니다.')
      await loadReviews()
    } else {
      alert(result.message || '리뷰 삭제에 실패했습니다.')
    }
  }
  
  // 리뷰 작성 성공 시
  const handleReviewSuccess = () => {
    loadReviews()
    loadReviewStats()
  }
  
  const handleCategoryRating = (category: keyof typeof categoryRatings) => {
    if (category === 'revisit') {
      setCategoryRatings(prev => ({
        ...prev,
        [category]: prev[category] === 0 ? 5 : 0
      }))
      if (categoryRatings.revisit === 0) {
        setFavorites(true)
      }
    } else {
      setCategoryRatings(prev => ({
        ...prev,
        [category]: prev[category] < 5 ? prev[category] + 1 : 1
      }))
    }
  }
  
  // 평균 별점 계산 (5개 중 5개만 선택해도 5점 가능)
  const calculateAverageRating = () => {
    const selectedCategories = Object.entries(categoryRatings)
      .filter(([key, value]) => value > 0 && key !== 'revisit')
    if (selectedCategories.length === 0) return 0
    const sum = selectedCategories.reduce((acc, [, value]) => acc + value, 0)
    return (sum / selectedCategories.length).toFixed(1)
  }
  
  // 중복 예약 체크
  const isTimeSlotBooked = (date: Date, time: string) => {
    if (!date) return false
    const dateStr = format(date, 'yyyy년 M월 d일')
    return myReservations.some(reservation => {
      const resDate = reservation.reservation_date
      const resTime = reservation.reservation_time
      // 날짜 형식 비교
      return resDate.includes(dateStr) && resTime === time
    })
  }
  
  // 예약 취소 기능
  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm('정말 예약을 취소하시겠습니까?')) {
      return
    }
    
    setCancellingReservation(reservationId)
    
    try {
      // 1. 취소할 예약 정보 찾기
      const reservationToCancel = myReservations.find(r => r.id === reservationId)
      if (!reservationToCancel) {
        alert('예약 정보를 찾을 수 없습니다.')
        return
      }
      
      // 2. 예약 취소 처리
      const { cancelReservation } = await import('@/lib/reservations')
      const result = await cancelReservation(reservationId)
      
      if (result.success) {
        // 3. 취소 메일 발송
        try {
          const { sendCancellationNotifications } = await import('@/lib/notifications')
          const cancellationData = {
            customerName: user!.name,
            customerEmail: user!.email,
            customerPhone: user!.phone,
            date: reservationToCancel.reservation_date,
            time: reservationToCancel.reservation_time,
            partySize: reservationToCancel.party_size,
            restaurantName: '맛집 예약 포털'
          }
          
          const notificationResult = await sendCancellationNotifications(cancellationData)
          
          let message = '예약이 취소되었습니다.'
          if (notificationResult.emailSent) {
            message += '\n📧 취소 안내 메일을 발송했습니다.'
          }
          
          alert(message)
        } catch (emailError) {
          console.error('취소 메일 발송 실패:', emailError)
          alert('예약은 취소되었지만 메일 발송에 실패했습니다.')
        }
        
        // 4. 예약 목록 업데이트
        await loadUserReservations()
        
        // 5. 취소된 예약이 마지막 예약이었다면 클리어
        if (lastReservation?.id === reservationId) {
          setLastReservation(null)
        }
      } else {
        alert('예약 취소에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('예약 취소 오류:', error)
      alert('예약 취소 중 오류가 발생했습니다.')
    } finally {
      setCancellingReservation(null)
    }
  }

  // 예약 처리 함수
  const handleReservation = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.')
      return
    }
    
    // 중복 예약 체크
    if (isTimeSlotBooked(selectedDate, selectedTime)) {
      alert('이미 해당 시간에 예약이 있습니다. 다른 시간을 선택해주세요.')
      return
    }

    setIsProcessingReservation(true)

    try {
      // 예약 데이터 구성
      const dayName = format(selectedDate, 'EEEE', { locale: ko })
      const formattedDate = format(selectedDate, 'yyyy년 M월 d일', { locale: ko })
      
      const reservationData: ReservationData = {
        customerName: user!.name,
        customerEmail: user!.email,
        customerPhone: user!.phone,
        date: `${formattedDate} (${dayName})`,
        time: selectedTime,
        partySize: partySize,
        restaurantName: '맛집 예약 포털'
      }

      // 1. 먼저 DB에 예약 저장
      const { createReservation } = await import('@/lib/reservations')
      const reservationResult = await createReservation(user!.id, reservationData)
      
      if (!reservationResult.success) {
        throw new Error(reservationResult.message)
      }

      // 2. 예약 저장 성공 후 알림 발송
      const notificationResults = await sendReservationNotifications(
        reservationData, 
        reservationResult.reservation?.id
      )
      
      let message = '예약이 완료되어 데이터베이스에 저장되었습니다!'
      if (notificationResults.emailSent && notificationResults.smsSent) {
        message += '\n📧 이메일과 📱 SMS로 예약 확정 안내를 발송했습니다.'
      } else if (notificationResults.emailSent) {
        message += '\n📧 이메일로 예약 확정 안내를 발송했습니다.'
      } else if (notificationResults.smsSent) {
        message += '\n📱 SMS로 예약 확정 안내를 발송했습니다.'
      }

      alert(message)
      setShowReservation(true)
      
      // 예약 정보 저장 및 목록 업데이트
      const fullReservation = {
        ...reservationData,
        id: reservationResult.reservation?.id
      }
      setLastReservation(fullReservation)
      console.log('예약 정보 저장:', fullReservation)
      
      // 예약 목록 다시 로드
      await loadUserReservations()
      
      console.log('✅ 예약 DB 저장 완료:', reservationResult.reservation)
      
      // 예약 완료 후 폼 숨기기
      setShowReservationForm(false)
    } catch (error) {
      console.error('예약 처리 중 오류:', error)
      alert('예약 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsProcessingReservation(false)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff1ee 0%, #ffe4de 100%)'
    }}>
      {/* 헤더 */}
      <div style={{ 
        background: 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
        padding: '1rem',
        boxShadow: '0 2px 10px rgba(255, 107, 53, 0.2)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 'bold', 
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            🍽️ 맛집 예약 포털
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isLoggedIn ? (
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <span style={{ color: 'white', fontSize: '0.875rem' }}>
                  안녕하세요, {user?.name}님! 👋
                </span>
                <button 
                  onClick={logout}
                  style={{ 
                    padding: '0.5rem 1rem', 
                    background: 'rgba(255,255,255,0.2)', 
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}>
                  로그아웃
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  background: 'rgba(255,255,255,0.2)', 
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer'
                }}>
                로그인
              </button>
            )}
            <HeartIconSolid style={{ width: '1.5rem', height: '1.5rem', color: 'white', cursor: 'pointer' }} />
          </div>
        </div>
      </div>

      {/* 메인 2x3 그리드 - 모바일 최적화 */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
        <style jsx>{`
          .dashboard-grid {
            display: grid;
            gap: 1.5rem;
          }
          
          /* 데스크톱: 2x3 그리드 */
          @media (min-width: 769px) {
            .dashboard-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 1.5rem;
            }
          }
          
          /* 모바일: 1열 세로 배치, 터치 최적화 */
          @media (max-width: 768px) {
            .dashboard-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
              padding: 0 0.5rem;
            }
            .mobile-card {
              margin-bottom: 0.5rem;
              border-radius: 1.25rem !important;
              box-shadow: 0 8px 25px rgba(255, 107, 53, 0.12) !important;
            }
            /* 모바일 터치 버튼 최적화 */
            .mobile-card button {
              min-height: 44px !important;
              padding: 0.75rem !important;
              font-size: 0.9rem !important;
            }
            /* 모바일 헤더 최적화 */
            .mobile-header {
              padding: 0.75rem 1rem !important;
              text-align: center;
            }
          }
        `}</style>
        <div className="dashboard-grid">
          
          {/* 1. 인기 메뉴 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mobile-card"
            style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
              border: '2px solid #ff6b35'
            }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              padding: '1rem',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>🍕</span> 인기 메뉴
              </h2>
            </div>
            <div style={{ padding: '1rem' }}>
              {[
                { name: '스테이크 세트', price: '35,000원', desc: '오늘의 특선', tag: 'BEST', img: '🥩' },
                { name: '파스타 코스', price: '28,000원', desc: '2인 세트', tag: 'HOT', img: '🍝' },
                { name: '시그니처 피자', price: '24,000원', desc: '직화 화덕', tag: 'NEW', img: '🍕' },
                { name: '샐러드 뷔페', price: '18,000원', desc: '건강식', img: '🥗' },
              ].map((menu, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: 'linear-gradient(90deg, #fff8f6 0%, #fff1ee 100%)',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  border: '1px solid #ffd4cc'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(5px)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.2)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateX(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                  <span style={{ fontSize: '2rem', marginRight: '1rem' }}>{menu.img}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '600', color: '#2c3e50' }}>{menu.name}</span>
                      {menu.tag && (
                        <span style={{
                          padding: '0.125rem 0.375rem',
                          background: menu.tag === 'BEST' ? '#ff6b35' : menu.tag === 'HOT' ? '#f55336' : '#ff8157',
                          color: 'white',
                          fontSize: '0.625rem',
                          borderRadius: '0.25rem',
                          fontWeight: 'bold'
                        }}>{menu.tag}</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>{menu.desc}</div>
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#ff6b35', fontSize: '1.125rem' }}>{menu.price}</div>
                </div>
              ))}
              <button 
                onClick={() => setShowMenuPopup(true)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}>
                전체 메뉴 보기 →
              </button>
            </div>
          </motion.div>

          {/* 2. 예약하기 섹션 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mobile-card"
            style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
              border: '2px solid #ff6b35'
            }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              padding: '1rem',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <CalendarIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                빠른 예약
              </h2>
            </div>
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
              showReservationForm={showReservationForm}
              setShowReservationForm={setShowReservationForm}
              handleCancelReservation={handleCancelReservation}
              cancellingReservation={cancellingReservation}
            />
          </motion.div>

          {/* 3. 매장 갤러리 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mobile-card"
            style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
              border: '2px solid #ff6b35'
            }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              padding: '1rem',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <CameraIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                매장 갤러리
              </h2>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {[
                  { emoji: '🍽️', label: '실내' },
                  { emoji: '🍕', label: '메뉴' },
                  { emoji: '🎂', label: '디저트' },
                  { emoji: '🍷', label: '와인' },
                  { emoji: '🥗', label: '샐러드' },
                  { emoji: '☕', label: '카페' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    aspectRatio: '1',
                    background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                    borderRadius: '0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: '1px solid #ffd4cc'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 179, 153, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}>
                    <div style={{ fontSize: '2rem' }}>{item.emoji}</div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d', marginTop: '0.25rem' }}>{item.label}</div>
                  </div>
                ))}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                borderRadius: '0.5rem'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>총 48장의 사진</div>
                  <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>최근 업데이트: 2일 전</div>
                </div>
                <button style={{
                  padding: '0.5rem 1rem',
                  background: 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  모두 보기
                </button>
              </div>
            </div>
          </motion.div>

          {/* 4. 리얼 후기 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="mobile-card"
            style={{
              background: 'white',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
              border: '2px solid #ff6b35'
            }}
          >
            <div style={{ 
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              padding: '1rem',
              color: 'white'
            }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <ChatBubbleBottomCenterTextIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                리얼 후기
              </h2>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                borderRadius: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35' }}>
                    {reviewStats?.avg_rating ? parseFloat(reviewStats.avg_rating).toFixed(1) : '0.0'}
                  </span>
                  <div>
                    <div style={{ display: 'flex' }}>
                      {[1,2,3,4,5].map(star => (
                        <StarIconSolid key={star} style={{ 
                          width: '1rem', 
                          height: '1rem',
                          color: star <= Math.round(reviewStats?.avg_rating || 0) ? '#ffb347' : '#e0e0e0'
                        }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                      {reviewStats?.total_reviews || 0}개 리뷰
                    </div>
                  </div>
                </div>
                <HeartIcon style={{ width: '1.5rem', height: '1.5rem', color: '#ff6b35', cursor: 'pointer' }} />
              </div>

              <button 
                onClick={() => handleOpenReviewModal()}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginBottom: '1rem'
                }}>
                리뷰 작성하기 ✍️
              </button>

              {/* 카테고리별 평점 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                {[
                  { key: 'taste', label: '맛', emoji: '🍽️' },
                  { key: 'service', label: '서비스', emoji: '👨‍🍳' },
                  { key: 'cleanliness', label: '청결', emoji: '✨' },
                  { key: 'atmosphere', label: '분위기', emoji: '🕯️' },
                  { key: 'parking', label: '주차', emoji: '🚗' },
                  { key: 'revisit', label: '재방문', emoji: '❤️' }
                ].map(category => (
                  <button
                    key={category.key}
                    onClick={() => handleCategoryRating(category.key as keyof typeof categoryRatings)}
                    style={{
                      padding: '0.75rem 0.5rem',
                      background: categoryRatings[category.key as keyof typeof categoryRatings] > 0 
                        ? 'linear-gradient(135deg, #ff6b35, #f55336)' 
                        : 'white',
                      color: categoryRatings[category.key as keyof typeof categoryRatings] > 0 
                        ? 'white' 
                        : '#ff6b35',
                      border: '2px solid #ff6b35',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                    onMouseEnter={(e) => {
                      if (categoryRatings[category.key as keyof typeof categoryRatings] === 0) {
                        e.currentTarget.style.background = '#fff1ee'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (categoryRatings[category.key as keyof typeof categoryRatings] === 0) {
                        e.currentTarget.style.background = 'white'
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{category.emoji}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{category.label}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                      {category.key === 'revisit' 
                        ? (categoryRatings[category.key as keyof typeof categoryRatings] > 0 ? '예' : '-')
                        : (categoryRatings[category.key as keyof typeof categoryRatings] > 0 
                          ? `${categoryRatings[category.key as keyof typeof categoryRatings]}점` 
                          : '-')}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* 평균 점수 표시 */}
              {Object.values(categoryRatings).some(v => v > 0) && (
                <div style={{
                  padding: '0.5rem',
                  background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                  borderRadius: '0.5rem',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                  border: '1px solid #ffd4cc'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>평균 평점: </span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ff6b35' }}>
                    {calculateAverageRating()}점
                  </span>
                  {favorites && (
                    <span style={{ marginLeft: '0.5rem', color: '#ff6b35' }}>
                      ❤️ 즐겨찾기 추가됨
                    </span>
                  )}
                </div>
              )}

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {reviews.length > 0 ? reviews.slice(0, 5).map((review, idx) => (
                  <div key={review.id} style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: idx === 0 ? 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)' : 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #ffd4cc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                        {review.users?.name || '익명'}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {review.user_id === user?.id && (
                          <>
                            <button
                              onClick={() => handleEditReview(review)}
                              style={{
                                fontSize: '0.75rem',
                                color: '#ff6b35',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                              }}>수정</button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              style={{
                                fontSize: '0.75rem',
                                color: '#999',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                              }}>삭제</button>
                          </>
                        )}
                        <span style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>
                          {new Date(review.created_at).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <div style={{ display: 'flex' }}>
                        {[1,2,3,4,5].map(star => (
                          <StarIconSolid key={star} style={{ 
                            width: '0.75rem', 
                            height: '0.75rem',
                            color: star <= Math.round(review.rating_average) ? '#ffb347' : '#e0e0e0'
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#ff6b35', fontWeight: 'bold' }}>
                        {parseFloat(String(review.rating_average)).toFixed(1)}점
                      </span>
                      {review.is_recommended && (
                        <span style={{ fontSize: '0.75rem', color: '#ff6b35' }}>👍 추천</span>
                      )}
                    </div>
                    {review.title && (
                      <div style={{ fontWeight: '600', fontSize: '0.875rem', color: '#2c3e50', marginBottom: '0.25rem' }}>
                        {review.title}
                      </div>
                    )}
                    <div style={{ fontSize: '0.875rem', color: '#555' }}>{review.content}</div>
                  </div>
                )) : (
                  <div style={{
                    padding: '2rem',
                    textAlign: 'center',
                    color: '#7f8c8d'
                  }}>
                    아직 작성된 리뷰가 없습니다.<br/>
                    첫 번째 리뷰를 작성해주세요!
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* 예약 클릭 시 표시되는 이벤트 섹션들 */}
          {showReservation && (
            <>
              {/* 5. 이벤트 & 쿠폰 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mobile-card"
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(255, 129, 87, 0.15)',
                  border: '2px solid #ff8157'
                }}
              >
                <div style={{ 
                  background: 'linear-gradient(135deg, #ff8157 0%, #ff9a76 100%)',
                  padding: '1rem',
                  color: 'white'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <TicketIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                    이벤트 & 쿠폰
                  </h2>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    border: '2px dashed #ff8157'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#ff6b35', fontWeight: 'bold' }}>첫 방문 고객</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2c3e50' }}>20% 할인</div>
                        <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>~12/31까지</div>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>🎁</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    border: '2px dashed #ff9a76'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#f55336', fontWeight: 'bold' }}>생일 쿠폰</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2c3e50' }}>케이크 서비스</div>
                        <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>생일 당일</div>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>🎂</div>
                    </div>
                  </div>

                  <div style={{
                    background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    border: '2px dashed #ffb399'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#ff8157', fontWeight: 'bold' }}>단골 혜택</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2c3e50' }}>10% 적립</div>
                        <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>5회 방문시</div>
                      </div>
                      <div style={{ fontSize: '2.5rem' }}>💝</div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* 6. 포털 이벤트 */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mobile-card"
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 30px rgba(255, 154, 118, 0.15)',
                  border: '2px solid #ff9a76'
                }}
              >
                <div style={{ 
                  background: 'linear-gradient(135deg, #ff9a76 0%, #ffb399 100%)',
                  padding: '1rem',
                  color: 'white'
                }}>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                    <SparklesIcon style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                    포털 이벤트
                  </h2>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '1rem',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>🔥 진행중인 이벤트</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>369 이벤트</div>
                    <div style={{ fontSize: '0.875rem' }}>3, 6, 9일 방문시 30% 할인!</div>
                    <div style={{ 
                      marginTop: '0.75rem',
                      padding: '0.5rem',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '0.5rem',
                      textAlign: 'center'
                    }}>
                      참여 고객: <strong>1,234명</strong>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                    <div style={{
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                      borderRadius: '0.5rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b35' }}>15%</div>
                      <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>평일 런치</div>
                    </div>
                    <div style={{
                      padding: '0.75rem',
                      background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                      borderRadius: '0.5rem',
                      textAlign: 'center'
                    }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f55336' }}>2+1</div>
                      <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>음료 이벤트</div>
                    </div>
                  </div>

                  <button style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(90deg, #ff9a76 0%, #ffb399 100%)',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}>
                    모든 이벤트 보기 →
                  </button>
                </div>
              </motion.div>
            </>
          )}
          
        </div>
      </div>
      
      {/* 메뉴 팝업 */}
      {showMenuPopup && (
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
          zIndex: 1000,
          padding: '1rem'
        }}
        onClick={() => setShowMenuPopup(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'white',
              borderRadius: '1rem',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
            }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              padding: '1.5rem',
              color: 'white',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>🍕 전체 메뉴</h2>
                <button
                  onClick={() => setShowMenuPopup(false)}
                  style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}>
                  ✕
                </button>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {/* 메인 요리 */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ff6b35', marginBottom: '1rem' }}>메인 요리</h3>
                {[
                  { name: '프리미엄 한우 스테이크', price: '58,000원', desc: '1++ 등급 한우 채끝 200g' },
                  { name: '트러플 크림 파스타', price: '32,000원', desc: '프랑스산 트러플 오일 사용' },
                  { name: '시그니처 마르게리타', price: '24,000원', desc: '수제 도우, 이탈리아 모짜렐라' },
                  { name: '해산물 리조또', price: '28,000원', desc: '신선한 새우와 관자' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    background: 'linear-gradient(90deg, #fff8f6 0%, #fff1ee 100%)',
                    borderRadius: '0.75rem',
                    border: '1px solid #ffd4cc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#2c3e50' }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.25rem' }}>{item.desc}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#ff6b35' }}>{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 사이드 메뉴 */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ff6b35', marginBottom: '1rem' }}>사이드 & 샐러드</h3>
                {[
                  { name: '시저 샐러드', price: '15,000원', desc: '로메인, 파마산, 크루통' },
                  { name: '감자튀김', price: '8,000원', desc: '트러플 소금 제공' },
                  { name: '마늘빵', price: '6,000원', desc: '수제 버터 갈릭 브레드' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    background: 'linear-gradient(90deg, #fff8f6 0%, #fff1ee 100%)',
                    borderRadius: '0.75rem',
                    border: '1px solid #ffd4cc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#2c3e50' }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.25rem' }}>{item.desc}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#ff6b35' }}>{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 음료 */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ff6b35', marginBottom: '1rem' }}>음료 & 디저트</h3>
                {[
                  { name: '하우스 와인', price: '12,000원', desc: '레드/화이트 선택' },
                  { name: '수제 레모네이드', price: '7,000원', desc: '민트 & 라임' },
                  { name: '티라미수', price: '9,000원', desc: '이탈리아 정통 레시피' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    background: 'linear-gradient(90deg, #fff8f6 0%, #fff1ee 100%)',
                    borderRadius: '0.75rem',
                    border: '1px solid #ffd4cc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#2c3e50' }}>{item.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#7f8c8d', marginTop: '0.25rem' }}>{item.desc}</div>
                      </div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#ff6b35' }}>{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={login}
      />
      
      {/* 리뷰 작성/수정 모달 */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false)
          setSelectedReservationForReview(undefined)
          setEditingReview(undefined)
        }}
        userId={user?.id || ''}
        userName={user?.name}
        reservationId={selectedReservationForReview}
        existingReview={editingReview}
        onSuccess={handleReviewSuccess}
      />
    </div>
  )
}

export default CustomerPortal