'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { useAuth } from '@/contexts/AuthContext'
import LoginModal from '@/components/auth/LoginModal'
import { getRestaurantBySlug } from '@/lib/restaurants'
import type { Restaurant } from '@/types/restaurant'

interface ReservationData {
  date: Date
  time: string
  partySize: number
  customerName: string
  customerEmail: string
  customerPhone: string
  specialRequest?: string
}

function ReservationContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const restaurantSlug = searchParams.get('restaurant')
  const { user, isLoggedIn } = useAuth()
  
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  // 예약 정보
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('12:00')
  const [partySize, setPartySize] = useState<number>(2)
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [specialRequest, setSpecialRequest] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (restaurantSlug) {
      loadRestaurant(restaurantSlug)
    }
  }, [restaurantSlug])

  useEffect(() => {
    if (user) {
      setCustomerName(user.name || '')
      setCustomerEmail(user.email || '')
      setCustomerPhone(user.phone || '')
    }
  }, [user])

  const loadRestaurant = async (slug: string) => {
    try {
      setLoading(true)
      const result = await getRestaurantBySlug(slug)
      if (result.success && result.restaurant) {
        setRestaurant(result.restaurant)
      }
    } catch (error) {
      console.error('레스토랑 정보 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 예약 가능한 시간대 생성
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 11; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  // 오늘부터 30일간의 날짜 생성
  const generateDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const dateOptions = generateDateOptions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 로그인 확인
    if (!isLoggedIn) {
      setShowLoginModal(true)
      return
    }
    
    if (!customerName || !customerEmail || !customerPhone) {
      alert('모든 필수 정보를 입력해주세요.')
      return
    }

    if (!restaurant) {
      alert('레스토랑 정보를 불러올 수 없습니다.')
      return
    }

    setIsProcessing(true)
    
    try {
      const { sendReservationNotifications } = await import('@/lib/notifications')
      const { createReservation } = await import('@/lib/reservations')
      
      const dayName = format(selectedDate, 'EEEE', { locale: ko })
      const formattedDate = format(selectedDate, 'yyyy년 M월 d일', { locale: ko })
      
      const reservationData = {
        customerName,
        customerEmail,
        customerPhone,
        date: `${formattedDate} (${dayName})`,
        time: selectedTime,
        partySize,
        restaurantName: restaurant.name,
        specialRequest
      }

      // DB에 예약 저장
      const reservationResult = await createReservation(
        user?.id || '', 
        reservationData, 
        restaurant.id
      )
      
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
      router.push('/dashboard')
    } catch (error) {
      console.error('예약 처리 중 오류:', error)
      alert('예약 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
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
        <p className="text-gray-500 text-lg mb-4">레스토랑 정보를 찾을 수 없습니다.</p>
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
      background: 'linear-gradient(135deg, #fff1ee 0%, #ffe4de 100%)',
      paddingBottom: '2rem'
    }}>
      {/* 헤더 */}
      <div style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem',
          position: 'relative'
        }}>
          <button
            onClick={() => router.back()}
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '3rem',
              height: '3rem',
              borderRadius: '50%',
              border: 'none',
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
            }}
          >
            <ArrowLeftIcon style={{ width: '1.5rem', height: '1.5rem' }} />
          </button>
          <div style={{
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#ff6b35',
              margin: '0'
            }}>
              예약하기
            </h1>
            <p style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              margin: '0.25rem 0 0 0'
            }}>
              {restaurant.name}
            </p>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {/* 레스토랑 정보 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
            border: '2px solid #ff6b35'
          }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #F3F4F6',
            paddingBottom: '0.75rem'
          }}>
            레스토랑 정보
          </h2>
          
          {restaurant.image_url && (
            <img
              src={restaurant.image_url}
              alt={restaurant.name}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '1rem',
                marginBottom: '1rem'
              }}
            />
          )}
          
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#ff6b35',
            marginBottom: '0.5rem'
          }}>
            {restaurant.name}
          </h3>
          
          {restaurant.description && (
            <p style={{
              color: '#6B7280',
              marginBottom: '1rem',
              lineHeight: 1.6
            }}>
              {restaurant.description}
            </p>
          )}
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '1.5rem'
          }}>
            {restaurant.address && (
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                color: '#6B7280'
              }}>
                <MapPinIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem' }}>{restaurant.address}</span>
              </div>
            )}
            
            {restaurant.phone && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6B7280'
              }}>
                <PhoneIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                <span style={{ fontSize: '0.875rem' }}>{restaurant.phone}</span>
              </div>
            )}
            
            {restaurant.opening_hours && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#6B7280'
              }}>
                <ClockIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                <span style={{ fontSize: '0.875rem' }}>매일 11:00 - 22:00</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* 예약 폼 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '2rem',
            boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
            border: '2px solid #ff6b35'
          }}
        >
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#374151',
            marginBottom: '1.5rem',
            borderBottom: '2px solid #F3F4F6',
            paddingBottom: '0.75rem'
          }}>
            예약 정보
          </h2>

          <form onSubmit={handleSubmit}>
            {/* 날짜 선택 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <CalendarIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                날짜 선택
              </label>
              <select
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff6b35'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB'
                }}
              >
                {dateOptions.map((date) => (
                  <option key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                    {format(date, 'yyyy년 M월 d일 (EEEE)', { locale: ko })}
                  </option>
                ))}
              </select>
            </div>

            {/* 시간 선택 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <ClockIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                시간 선택
              </label>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.5rem',
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '0.5rem',
                border: '2px solid #E5E7EB',
                borderRadius: '0.75rem'
              }}>
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.5rem',
                      border: selectedTime === time ? '2px solid #ff6b35' : '2px solid transparent',
                      background: selectedTime === time ? 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)' : '#F9FAFB',
                      color: selectedTime === time ? 'white' : '#374151',
                      fontWeight: selectedTime === time ? '600' : '400',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTime !== time) {
                        e.currentTarget.style.background = '#FFF5F3'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTime !== time) {
                        e.currentTarget.style.background = '#F9FAFB'
                      }
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* 인원수 선택 */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '0.5rem'
              }}>
                <UserGroupIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                인원수
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <button
                  type="button"
                  onClick={() => setPartySize(Math.max(1, partySize - 1))}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    border: '2px solid #E5E7EB',
                    background: 'white',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ff6b35'
                    e.currentTarget.style.background = '#FFF5F3'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB'
                    e.currentTarget.style.background = 'white'
                  }}
                >
                  -
                </button>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: '#ff6b35',
                  minWidth: '3rem',
                  textAlign: 'center'
                }}>
                  {partySize}명
                </span>
                <button
                  type="button"
                  onClick={() => setPartySize(Math.min(20, partySize + 1))}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    border: '2px solid #E5E7EB',
                    background: 'white',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ff6b35'
                    e.currentTarget.style.background = '#FFF5F3'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB'
                    e.currentTarget.style.background = 'white'
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* 예약자 정보 */}
            <div style={{
              borderTop: '2px solid #F3F4F6',
              paddingTop: '1.5rem',
              marginTop: '1.5rem'
            }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '1rem'
              }}>
                예약자 정보
              </h3>

              {/* 이름 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <UserIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                  이름 *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="예약자 성함"
                  required
                  style={{
                    width: 'calc(100% - 1.5rem)',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b35'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB'
                  }}
                />
              </div>

              {/* 이메일 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <EnvelopeIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                  이메일 *
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  style={{
                    width: 'calc(100% - 1.5rem)',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b35'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB'
                  }}
                />
              </div>

              {/* 전화번호 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  <PhoneIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
                  전화번호 *
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="010-0000-0000"
                  required
                  style={{
                    width: 'calc(100% - 1.5rem)',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b35'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB'
                  }}
                />
              </div>

              {/* 특별 요청사항 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '0.5rem'
                }}>
                  특별 요청사항 (선택)
                </label>
                <textarea
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="알레르기, 특별한 요청사항이 있으시면 적어주세요"
                  rows={3}
                  style={{
                    width: 'calc(100% - 1.5rem)',
                    padding: '0.75rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ff6b35'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#E5E7EB'
                  }}
                />
              </div>
            </div>

            {/* 예약 버튼 */}
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: isProcessing 
                  ? '#D1D5DB'
                  : 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                color: 'white',
                fontWeight: '600',
                fontSize: '1.125rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isProcessing) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
                }
              }}
            >
              {isProcessing ? '처리중...' : '예약 확정'}
            </button>
          </form>
        </motion.div>
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => setShowLoginModal(false)}
      />
    </div>
  )
}

export default function ReservationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <ReservationContent />
    </Suspense>
  )
}