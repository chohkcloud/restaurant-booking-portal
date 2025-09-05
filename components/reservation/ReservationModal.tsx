'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  CalendarIcon,
  ClockIcon,
  UserGroupIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  restaurantName: string
  restaurantId: string
  onConfirm: (reservationData: ReservationData) => Promise<void>
  isLoggedIn: boolean
  user?: {
    name: string
    email: string
    phone: string
  }
}

interface ReservationData {
  date: Date
  time: string
  partySize: number
  customerName: string
  customerEmail: string
  customerPhone: string
  specialRequest?: string
}

export default function ReservationModal({
  isOpen,
  onClose,
  restaurantName,
  restaurantId,
  onConfirm,
  isLoggedIn,
  user
}: ReservationModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('12:00')
  const [partySize, setPartySize] = useState<number>(2)
  const [customerName, setCustomerName] = useState(user?.name || '')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '')
  const [specialRequest, setSpecialRequest] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

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
    
    if (!customerName || !customerEmail || !customerPhone) {
      alert('모든 필수 정보를 입력해주세요.')
      return
    }

    setIsProcessing(true)
    
    try {
      await onConfirm({
        date: selectedDate,
        time: selectedTime,
        partySize,
        customerName,
        customerEmail,
        customerPhone,
        specialRequest
      })
      
      onClose()
    } catch (error) {
      console.error('예약 실패:', error)
      alert('예약 처리 중 오류가 발생했습니다.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 배경 오버레이 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 40,
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* 모달 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              borderRadius: '1.5rem',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '85vh',
              overflow: 'hidden',
              zIndex: 50
            }}
          >
            {/* 헤더 */}
            <div style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              padding: '1.5rem',
              color: 'white'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    marginBottom: '0.25rem'
                  }}>
                    예약하기
                  </h2>
                  <p style={{
                    fontSize: '1rem',
                    opacity: 0.9
                  }}>
                    {restaurantName}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </button>
              </div>
            </div>

            {/* 본문 */}
            <div style={{
              padding: '1.5rem',
              overflowY: 'auto',
              maxHeight: 'calc(85vh - 180px)'
            }}>
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
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.5rem'
                  }}>
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: selectedTime === time ? '2px solid #ff6b35' : '2px solid #E5E7EB',
                          background: selectedTime === time ? 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)' : 'white',
                          color: selectedTime === time ? 'white' : '#374151',
                          fontWeight: selectedTime === time ? '600' : '400',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedTime !== time) {
                            e.currentTarget.style.borderColor = '#ff6b35'
                            e.currentTarget.style.background = '#FFF5F3'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedTime !== time) {
                            e.currentTarget.style.borderColor = '#E5E7EB'
                            e.currentTarget.style.background = 'white'
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

                {/* 고객 정보 */}
                <div style={{
                  borderTop: '1px solid #E5E7EB',
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
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
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
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
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
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
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
                  <div style={{ marginBottom: '1rem' }}>
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
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #E5E7EB',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        resize: 'vertical'
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

                {/* 버튼 */}
                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '2rem'
                }}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border: '2px solid #E5E7EB',
                      background: 'white',
                      color: '#6B7280',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ff6b35'
                      e.currentTarget.style.color = '#ff6b35'
                      e.currentTarget.style.background = '#FFF5F3'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E5E7EB'
                      e.currentTarget.style.color = '#6B7280'
                      e.currentTarget.style.background = 'white'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      borderRadius: '0.75rem',
                      border: 'none',
                      background: isProcessing 
                        ? '#D1D5DB'
                        : 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1rem',
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
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}