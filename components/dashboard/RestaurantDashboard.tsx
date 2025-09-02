'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  CalendarIcon, 
  UsersIcon, 
  ClockIcon,
  ChartBarIcon,
  StarIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

const RestaurantDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                맛집 포털
              </h1>
              <span className="ml-4 text-sm text-gray-500">오늘의 예약 관리</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-orange-600 transition-colors">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="h-8 w-8 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 대시보드 - 2x3 그리드 */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <style jsx>{`
          @media (max-width: 768px) {
            .dashboard-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>
        <div className="dashboard-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.5rem'
        }}>
          
          {/* 1. 오늘의 예약 현황 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-1">
              <div className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <CalendarIcon className="h-6 w-6 mr-2 text-orange-500" />
                    오늘의 예약
                  </h2>
                  <span className="text-3xl font-bold text-orange-600">24</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="font-medium">12:00</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">김철수</span>
                      <span className="text-gray-500 ml-2">4명</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">확정</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="font-medium">13:30</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">이영희</span>
                      <span className="text-gray-500 ml-2">2명</span>
                    </div>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">대기</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="font-medium">19:00</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">박민수</span>
                      <span className="text-gray-500 ml-2">6명</span>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">확정</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all">
                  전체 예약 보기
                </button>
              </div>
            </div>
          </motion.div>

          {/* 2. 실시간 테이블 현황 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-red-500 to-pink-500 p-1">
              <div className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <UsersIcon className="h-6 w-6 mr-2 text-red-500" />
                    테이블 현황
                  </h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">사용중</span>
                    <span className="text-2xl font-bold text-red-600">8/12</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(table => (
                    <div
                      key={table}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center font-bold text-sm
                        ${table <= 8 
                          ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                          : 'bg-green-100 text-green-700 border-2 border-green-300'}
                      `}
                    >
                      T{table}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">4</div>
                    <div className="text-xs text-gray-600">이용 가능</div>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-3 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-xs text-gray-600">예약 대기</div>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all">
                  테이블 관리
                </button>
              </div>
            </div>
          </motion.div>

          {/* 3. 인기 메뉴 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-1">
              <div className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    🔥 인기 메뉴 TOP 5
                  </h2>
                  <span className="text-sm text-gray-500">오늘 기준</span>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: '스테이크 정식', count: 12, price: '35,000원', trend: 'up' },
                    { name: '파스타 세트', count: 10, price: '28,000원', trend: 'up' },
                    { name: '샐러드 런치', count: 8, price: '18,000원', trend: 'same' },
                    { name: '리조또', count: 6, price: '22,000원', trend: 'down' },
                    { name: '와인 세트', count: 5, price: '45,000원', trend: 'up' },
                  ].map((menu, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-orange-50 rounded-lg transition-colors">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-orange-500 mr-3">{idx + 1}</span>
                        <div>
                          <div className="font-medium">{menu.name}</div>
                          <div className="text-sm text-gray-500">{menu.price}</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-600 mr-2">{menu.count}개</span>
                        {menu.trend === 'up' && <span className="text-green-500">↑</span>}
                        {menu.trend === 'down' && <span className="text-red-500">↓</span>}
                        {menu.trend === 'same' && <span className="text-gray-400">-</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 4. 매출 현황 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-1">
              <div className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <ChartBarIcon className="h-6 w-6 mr-2 text-purple-500" />
                    오늘의 매출
                  </h2>
                  <CreditCardIcon className="h-6 w-6 text-gray-400" />
                </div>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-purple-600">₩ 2,840,000</div>
                  <div className="text-sm text-green-600 font-medium">+12% 전일 대비</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">점심</span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{width: '65%'}}></div>
                    </div>
                    <span className="font-semibold">₩1,846,000</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">저녁</span>
                    <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full" style={{width: '35%'}}></div>
                    </div>
                    <span className="font-semibold">₩994,000</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">87</div>
                    <div className="text-xs text-gray-600">주문</div>
                  </div>
                  <div className="bg-indigo-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-indigo-600">32.6</div>
                    <div className="text-xs text-gray-600">객단가(만)</div>
                  </div>
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">94%</div>
                    <div className="text-xs text-gray-600">좌석율</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5. 고객 리뷰 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-1">
              <div className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center">
                    <StarIcon className="h-6 w-6 mr-2 text-pink-500" />
                    최신 리뷰
                  </h2>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-pink-600 mr-1">4.8</span>
                    <div className="flex">
                      {[1,2,3,4,5].map(star => (
                        <StarIconSolid 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">김지은</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <StarIconSolid key={star} className="h-3 w-3 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      분위기도 좋고 음식도 정말 맛있었어요! 특히 스테이크가 일품이었습니다.
                    </p>
                    <span className="text-xs text-gray-400">2시간 전</span>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">박준호</span>
                      <div className="flex">
                        {[1,2,3,4,5].map(star => (
                          <StarIconSolid key={star} className={`h-3 w-3 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      서비스가 친절하고 음식도 빨리 나왔어요. 재방문 의사 있습니다!
                    </p>
                    <span className="text-xs text-gray-400">5시간 전</span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all">
                  모든 리뷰 보기
                </button>
              </div>
            </div>
          </motion.div>

          {/* 6. 직원 관리 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1">
              <div className="bg-white p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    👥 오늘의 근무
                  </h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    8명 근무중
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">3</div>
                    <div className="text-xs text-gray-600">홀 직원</div>
                  </div>
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">5</div>
                    <div className="text-xs text-gray-600">주방 직원</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3"></div>
                      <div>
                        <div className="font-medium text-sm">홍길동 (매니저)</div>
                        <div className="text-xs text-gray-500">09:00 - 18:00</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mr-3"></div>
                      <div>
                        <div className="font-medium text-sm">김셰프 (주방장)</div>
                        <div className="text-xs text-gray-500">10:00 - 22:00</div>
                      </div>
                    </div>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
                
                <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all">
                  근무 일정 관리
                </button>
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
      
      {/* 하단 빠른 액션 버튼들 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex justify-around">
          <button className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition-colors">
            <CalendarIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">예약</span>
          </button>
          <button className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition-colors">
            <UsersIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">테이블</span>
          </button>
          <button className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition-colors">
            <PhoneIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">연락처</span>
          </button>
          <button className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition-colors">
            <ChartBarIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">통계</span>
          </button>
          <button className="flex flex-col items-center text-gray-600 hover:text-orange-600 transition-colors">
            <MapPinIcon className="h-6 w-6 mb-1" />
            <span className="text-xs">위치</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDashboard