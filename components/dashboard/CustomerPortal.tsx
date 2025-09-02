'use client'

import React, { useState } from 'react'
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

const CustomerPortal = () => {
  const [selectedDate, setSelectedDate] = useState(0) // 0 = 오늘
  const [selectedTime, setSelectedTime] = useState(1) // 1 = 12:00
  const [partySize, setPartySize] = useState(2)
  
  // 실제 날짜 생성
  const getDateOptions = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      const dayNames = ['일', '월', '화', '수', '목', '금', '토']
      
      if (i === 0) {
        dates.push({
          label: '오늘',
          detail: `${date.getDate()}일`,
          fullDate: date
        })
      } else if (i === 1) {
        dates.push({
          label: '내일',
          detail: `${date.getDate()}일`,
          fullDate: date
        })
      } else {
        dates.push({
          label: dayNames[date.getDay()],
          detail: `${date.getDate()}일`,
          fullDate: date
        })
      }
    }
    return dates
  }
  
  const dateOptions = getDateOptions()

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
            <button style={{ 
              padding: '0.5rem 1rem', 
              background: 'rgba(255,255,255,0.2)', 
              color: 'white',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255,255,255,0.3)',
              cursor: 'pointer'
            }}>
              로그인
            </button>
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
          
          {/* 1. 메뉴 */}
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
              <button style={{
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

          {/* 2. 예약창 */}
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
            <div style={{ padding: '1rem' }}>
              {/* 날짜 선택 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>날짜 선택</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                  {dateOptions.map((dateOption, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedDate(idx)}
                      style={{
                        padding: '0.5rem 0.25rem',
                        background: selectedDate === idx ? 'linear-gradient(135deg, #ff6b35, #f55336)' : '#fff8f6',
                        color: selectedDate === idx ? 'white' : '#ff6b35',
                        border: `2px solid ${selectedDate === idx ? '#ff6b35' : '#ffe4de'}`,
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: selectedDate === idx ? 'bold' : '500',
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        transition: 'all 0.2s',
                        boxShadow: selectedDate === idx ? '0 4px 12px rgba(255, 107, 53, 0.25)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedDate !== idx) {
                          e.currentTarget.style.background = '#fff1ee'
                          e.currentTarget.style.borderColor = '#ffccc0'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDate !== idx) {
                          e.currentTarget.style.background = '#fff8f6'
                          e.currentTarget.style.borderColor = '#ffe4de'
                        }
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{dateOption.label}</div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{dateOption.detail}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 시간 선택 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>시간 선택</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {['11:30', '12:00', '12:30', '13:00', '18:00', '18:30', '19:00', '19:30'].map((time, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setSelectedTime(idx)}
                      style={{
                        padding: '0.5rem',
                        background: selectedTime === idx ? 'linear-gradient(135deg, #ff6b35, #f55336)' : '#fff8f6',
                        color: selectedTime === idx ? 'white' : '#ff6b35',
                        border: `2px solid ${selectedTime === idx ? '#ff6b35' : '#ffe4de'}`,
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: selectedTime === idx ? 'bold' : '500',
                        transition: 'all 0.2s',
                        boxShadow: selectedTime === idx ? '0 4px 12px rgba(255, 107, 53, 0.25)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedTime !== idx) {
                          e.currentTarget.style.background = '#fff1ee'
                          e.currentTarget.style.borderColor = '#ffccc0'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedTime !== idx) {
                          e.currentTarget.style.background = '#fff8f6'
                          e.currentTarget.style.borderColor = '#ffe4de'
                        }
                      }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* 인원 선택 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>인원</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5, '6+'].map((size, idx) => (
                    <button 
                      key={size} 
                      onClick={() => setPartySize(typeof size === 'string' ? 6 : size)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: partySize === (typeof size === 'string' ? 6 : size) ? 'linear-gradient(135deg, #ff6b35, #f55336)' : '#fff8f6',
                        color: partySize === (typeof size === 'string' ? 6 : size) ? 'white' : '#ff6b35',
                        border: `2px solid ${partySize === (typeof size === 'string' ? 6 : size) ? '#ff6b35' : '#ffe4de'}`,
                        borderRadius: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: partySize === (typeof size === 'string' ? 6 : size) ? 'bold' : '500',
                        transition: 'all 0.2s',
                        boxShadow: partySize === (typeof size === 'string' ? 6 : size) ? '0 4px 12px rgba(255, 107, 53, 0.25)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (partySize !== (typeof size === 'string' ? 6 : size)) {
                          e.currentTarget.style.background = '#fff1ee'
                          e.currentTarget.style.borderColor = '#ffccc0'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (partySize !== (typeof size === 'string' ? 6 : size)) {
                          e.currentTarget.style.background = '#fff8f6'
                          e.currentTarget.style.borderColor = '#ffe4de'
                        }
                      }}
                    >
                      {size}명
                    </button>
                  ))}
                </div>
              </div>

              <button style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '1.125rem',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(245, 83, 54, 0.3)'
              }}>
                예약하기
              </button>
            </div>
          </motion.div>

          {/* 3. 이벤트/쿠폰 - 임시 숨김 */}
          {false && <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
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
          </motion.div>}

          {/* 4. 포털 이벤트 - 임시 숨김 */}
          {false && <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
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
          </motion.div>}

          {/* 5. 매장 사진 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
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

          {/* 6. 후기/댓글 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
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
                marginBottom: '1rem',
                padding: '0.75rem',
                background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                borderRadius: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ff6b35' }}>4.8</span>
                  <div>
                    <div style={{ display: 'flex' }}>
                      {[1,2,3,4,5].map(star => (
                        <StarIconSolid key={star} style={{ 
                          width: '1rem', 
                          height: '1rem',
                          color: star <= 4 ? '#ffb347' : '#e0e0e0'
                        }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>238개 리뷰</div>
                  </div>
                </div>
                <HeartIcon style={{ width: '1.5rem', height: '1.5rem', color: '#ff6b35', cursor: 'pointer' }} />
              </div>

              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {[
                  { name: '김맛집', rating: 5, comment: '정말 맛있어요! 재방문 의사 100%', time: '3시간 전' },
                  { name: '이고객', rating: 4, comment: '분위기 좋고 서비스도 친절해요', time: '1일 전' },
                  { name: '박리뷰', rating: 5, comment: '데이트 코스로 완벽합니다 👍', time: '2일 전' }
                ].map((review, idx) => (
                  <div key={idx} style={{
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    background: idx === 0 ? 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)' : 'white',
                    borderRadius: '0.5rem',
                    border: '1px solid #ffd4cc'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: '600', color: '#2c3e50' }}>{review.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#7f8c8d' }}>{review.time}</span>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '0.25rem' }}>
                      {[1,2,3,4,5].map(star => (
                        <StarIconSolid key={star} style={{ 
                          width: '0.75rem', 
                          height: '0.75rem',
                          color: star <= review.rating ? '#ffb347' : '#e0e0e0'
                        }} />
                      ))}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#555' }}>{review.comment}</div>
                  </div>
                ))}
              </div>

              <button style={{
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
                리뷰 작성하기 ✍️
              </button>
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  )
}

export default CustomerPortal