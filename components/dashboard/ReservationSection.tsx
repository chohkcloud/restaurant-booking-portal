import React from 'react'
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore, startOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'
import { 
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import type { ReservationInfo, ReservationRecord } from '@/types/reservation'

interface ReservationSectionProps {
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
  partySize: number
  setPartySize: (size: number) => void
  lastReservation: ReservationInfo | null
  myReservations: ReservationRecord[]
  isProcessingReservation: boolean
  isLoggedIn: boolean
  handleReservation: () => void
  isTimeSlotBooked: (date: Date, time: string) => boolean
}

const ReservationSection: React.FC<ReservationSectionProps> = ({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  partySize,
  setPartySize,
  lastReservation,
  myReservations,
  isProcessingReservation,
  isLoggedIn,
  handleReservation,
  isTimeSlotBooked
}) => {
  const [showCalendar, setShowCalendar] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  console.log('현재 예약 목록:', myReservations)
  console.log('마지막 예약:', lastReservation)
  
  const timeSlots = ['11:30', '12:00', '12:30', '13:00', '18:00', '18:30', '19:00', '19:30']
  
  // 달력 날짜 생성
  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }
  
  const days = getDaysInMonth()
  const startDay = startOfMonth(currentMonth).getDay()
  
  return (
    <div style={{ padding: '1rem' }}>
      {/* 예약 완료 메시지 */}
      {lastReservation && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, #e6ffe6 0%, #d4ffd4 100%)',
          borderRadius: '0.75rem',
          border: '2px solid #4caf50'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
            <CheckCircleIcon style={{ width: '1.5rem', height: '1.5rem', color: '#4caf50', marginRight: '0.5rem' }} />
            <span style={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '1.125rem' }}>예약이 확정되었습니다!</span>
          </div>
          <div style={{ background: 'white', padding: '0.75rem', borderRadius: '0.5rem' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#666', fontSize: '0.875rem' }}>고객명: </span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{lastReservation.customerName}</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#666', fontSize: '0.875rem' }}>예약일시: </span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{lastReservation.date} {lastReservation.time}</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: '#666', fontSize: '0.875rem' }}>인원: </span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{lastReservation.partySize}명</span>
            </div>
            <div>
              <span style={{ color: '#666', fontSize: '0.875rem' }}>레스토랑: </span>
              <span style={{ fontWeight: 'bold', color: '#333' }}>{lastReservation.restaurantName}</span>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#666' }}>
            📧 이메일과 📱 SMS로 예약 확정 안내를 발송했습니다.
          </div>
        </div>
      )}
      
      {/* 내 예약 목록 */}
      {myReservations && myReservations.length > 0 ? (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
          borderRadius: '0.75rem',
          border: '1px solid #ffd4cc'
        }}>
          <div style={{ fontWeight: 'bold', color: '#ff6b35', marginBottom: '0.75rem', fontSize: '1rem' }}>
            📅 나의 예약 정보 ({myReservations.length}건)
          </div>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {myReservations.map((reservation, idx) => (
              <div key={reservation.id || idx} style={{
                padding: '0.5rem',
                marginBottom: '0.5rem',
                background: 'white',
                borderRadius: '0.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600', color: '#333', fontSize: '0.875rem' }}>
                    {reservation.reservation_date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <ClockIcon style={{ width: '0.875rem', height: '0.875rem', color: '#666' }} />
                    <span style={{ fontSize: '0.75rem', color: '#666' }}>
                      {reservation.reservation_time} • {reservation.party_size}명
                    </span>
                  </div>
                </div>
                <div style={{
                  padding: '0.25rem 0.5rem',
                  background: '#4caf50',
                  color: 'white',
                  borderRadius: '0.25rem',
                  fontSize: '0.625rem',
                  fontWeight: 'bold'
                }}>
                  확정
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : isLoggedIn ? (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderRadius: '0.75rem',
          border: '1px solid #ccc',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            📅 예약된 내역이 없습니다.
          </div>
        </div>
      ) : null}
      
      {/* 날짜 선택 */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>
          날짜 선택
        </label>
        <button 
          onClick={() => setShowCalendar(!showCalendar)}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#fff8f6',
            border: '2px solid #ff6b35',
            borderRadius: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontWeight: '600', color: '#ff6b35' }}>
            {selectedDate ? format(selectedDate, 'yyyy년 M월 d일 (EEEE)', { locale: ko }) : '날짜를 선택하세요'}
          </span>
          <CalendarIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
        </button>
        
        {/* 달력 */}
        {showCalendar && (
          <div style={{
            marginTop: '0.5rem',
            background: 'white',
            border: '2px solid #ff6b35',
            borderRadius: '0.75rem',
            padding: '1rem',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <ChevronLeftIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
              </button>
              <span style={{ fontWeight: 'bold', color: '#333' }}>
                {format(currentMonth, 'yyyy년 M월', { locale: ko })}
              </span>
              <button
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <ChevronRightIcon style={{ width: '1.25rem', height: '1.25rem', color: '#ff6b35' }} />
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
              {['일', '월', '화', '수', '목', '금', '토'].map(day => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#666',
                  padding: '0.25rem'
                }}>
                  {day}
                </div>
              ))}
              
              {/* 빈 칸 */}
              {Array.from({ length: startDay }).map((_, idx) => (
                <div key={`empty-${idx}`} />
              ))}
              
              {/* 날짜 */}
              {days.map(day => {
                const isPast = isBefore(day, startOfDay(new Date()))
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const hasReservation = myReservations.some(r => {
                  const dateStr = format(day, 'yyyy년 M월 d일')
                  return r.reservation_date.includes(dateStr)
                })
                
                return (
                  <button
                    key={day.toString()}
                    onClick={() => !isPast && setSelectedDate(day)}
                    disabled={isPast}
                    style={{
                      padding: '0.5rem',
                      background: isSelected 
                        ? 'linear-gradient(135deg, #ff6b35, #f55336)' 
                        : isToday(day) 
                          ? '#fff1ee' 
                          : 'transparent',
                      color: isSelected 
                        ? 'white' 
                        : isPast 
                          ? '#ccc' 
                          : '#333',
                      border: isToday(day) && !isSelected 
                        ? '2px solid #ff6b35' 
                        : 'none',
                      borderRadius: '0.5rem',
                      cursor: isPast ? 'not-allowed' : 'pointer',
                      fontWeight: isToday(day) || isSelected ? 'bold' : 'normal',
                      fontSize: '0.875rem',
                      position: 'relative'
                    }}
                  >
                    {format(day, 'd')}
                    {hasReservation && (
                      <div style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '4px',
                        height: '4px',
                        background: isSelected ? 'white' : '#4caf50',
                        borderRadius: '50%'
                      }} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* 시간 선택 */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>
          시간 선택
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {timeSlots.map(time => {
            const isBooked = selectedDate && isTimeSlotBooked(selectedDate, time)
            
            return (
              <button
                key={time}
                onClick={() => !isBooked && setSelectedTime(time)}
                disabled={isBooked || false}
                style={{
                  padding: '0.5rem',
                  background: isBooked 
                    ? '#e0e0e0'
                    : selectedTime === time 
                      ? 'linear-gradient(135deg, #ff6b35, #f55336)' 
                      : '#fff8f6',
                  color: isBooked 
                    ? '#999'
                    : selectedTime === time 
                      ? 'white' 
                      : '#ff6b35',
                  border: `2px solid ${isBooked ? '#ccc' : selectedTime === time ? '#ff6b35' : '#ffe4de'}`,
                  borderRadius: '0.75rem',
                  cursor: isBooked ? 'not-allowed' : 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: selectedTime === time ? 'bold' : '500',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
              >
                {time}
                {isBooked && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#ff6b35',
                    color: 'white',
                    fontSize: '0.5rem',
                    padding: '0.125rem 0.25rem',
                    borderRadius: '0.25rem',
                    fontWeight: 'bold'
                  }}>
                    예약됨
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
      
      {/* 인원 선택 */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>인원</label>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3, 4, 5, '6+'].map((size) => (
            <button
              key={size}
              onClick={() => setPartySize(typeof size === 'string' ? 6 : size)}
              style={{
                flex: 1,
                padding: '0.5rem',
                background: partySize === (typeof size === 'string' ? 6 : size) 
                  ? 'linear-gradient(135deg, #ff6b35, #f55336)' 
                  : '#fff8f6',
                color: partySize === (typeof size === 'string' ? 6 : size) 
                  ? 'white' 
                  : '#ff6b35',
                border: `2px solid ${partySize === (typeof size === 'string' ? 6 : size) ? '#ff6b35' : '#ffe4de'}`,
                borderRadius: '0.75rem',
                cursor: 'pointer',
                fontWeight: partySize === (typeof size === 'string' ? 6 : size) ? 'bold' : '500',
                transition: 'all 0.2s'
              }}
            >
              {size}명
            </button>
          ))}
        </div>
      </div>
      
      <button
        onClick={handleReservation}
        disabled={isProcessingReservation}
        style={{
          width: '100%',
          padding: '1rem',
          background: isProcessingReservation
            ? '#ccc'
            : isLoggedIn
              ? 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)'
              : 'linear-gradient(90deg, #28a745 0%, #20c997 100%)',
          color: 'white',
          borderRadius: '0.5rem',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '1.125rem',
          cursor: isProcessingReservation ? 'not-allowed' : 'pointer',
          boxShadow: isProcessingReservation ? 'none' : '0 4px 15px rgba(245, 83, 54, 0.3)'
        }}
      >
        {isProcessingReservation
          ? '예약 처리 중...'
          : isLoggedIn
            ? '예약하기'
            : '로그인 후 예약하기'}
      </button>
    </div>
  )
}

export default ReservationSection