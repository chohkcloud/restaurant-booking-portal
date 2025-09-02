'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ChefHatIcon, CalendarIcon, GiftIcon, TrophyIcon, CameraIcon, StarIcon } from 'lucide-react'
import GridBlock from './DashboardGrid'

const TestDashboard = () => {
    return (
        <div style={{ width: '100%', minHeight: '100vh', padding: '1.5rem', backgroundColor: '#f9fafb' }}>
            {/* 헤더 */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 text-center"
            >
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    🏪 Restaurant Portal MVP
                </h1>
                <p className="text-gray-600 mb-2">2×3 Tesla-Style 대시보드</p>
                <div className="flex justify-center items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Next.js 13+ App Router • IntelliJ IDEA • src 없는 구조</span>
                </div>
            </motion.div>

            {/* 2×3 그리드 - 명시적으로 2열로 설정 */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
                gap: '1.5rem',
                maxWidth: '1280px',
                margin: '0 auto'
            }}>

                {/* 첫 번째 줄: 메뉴 + 예약 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <GridBlock
                        title="📋 메뉴"
                        icon={<ChefHatIcon className="w-6 h-6" />}
                        className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200"
                    >
                        <div className="space-y-3">
                            <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">불고기정식</span>
                                        <div className="text-sm text-green-600">인기메뉴 🔥</div>
                                    </div>
                                    <span className="font-bold text-green-600">15,000원</span>
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">비빔밥</span>
                                        <div className="text-sm text-gray-500">한정식</div>
                                    </div>
                                    <span className="font-bold text-green-600">12,000원</span>
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="font-medium">갈비탕</span>
                                        <div className="text-sm text-gray-500">한정식</div>
                                    </div>
                                    <span className="font-bold text-green-600">13,000원</span>
                                </div>
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                                    메뉴 관리
                                </button>
                                <button className="px-4 py-2 bg-white text-green-600 border border-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                                    카테고리
                                </button>
                            </div>
                        </div>
                    </GridBlock>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <GridBlock
                        title="📅 예약"
                        icon={<CalendarIcon className="w-6 h-6" />}
                        className="bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200"
                    >
                        <div className="space-y-3">
                            <div className="grid grid-cols-4 gap-2">
                                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                                    <div className="text-xl font-bold text-blue-600">8</div>
                                    <div className="text-xs text-gray-500">총예약</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                                    <div className="text-xl font-bold text-green-600">6</div>
                                    <div className="text-xs text-gray-500">확정</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                                    <div className="text-xl font-bold text-yellow-600">2</div>
                                    <div className="text-xs text-gray-500">대기</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg text-center shadow-sm">
                                    <div className="text-xl font-bold text-red-600">0</div>
                                    <div className="text-xs text-gray-500">취소</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">김철수</span>
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">확정</span>
                                    </div>
                                    <div className="text-sm text-gray-500">오늘 12:00 • 4명 • 20,000원</div>
                                </div>

                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">이영희</span>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">대기</span>
                                    </div>
                                    <div className="text-sm text-gray-500">오늘 12:30 • 2명 • 15,000원</div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                                    예약 관리
                                </button>
                                <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                                    시간표
                                </button>
                            </div>
                        </div>
                    </GridBlock>
                </motion.div>

                {/* 두 번째 줄: 스탬프 + 이벤트 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <GridBlock
                        title="🏷️ 매장 스탬프"
                        icon={<GiftIcon className="w-6 h-6" />}
                        className="bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200"
                    >
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-xl font-bold text-yellow-600">3</div>
                                    <div className="text-xs text-gray-500">VIP</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-xl font-bold text-blue-600">8</div>
                                    <div className="text-xs text-gray-500">단골</div>
                                </div>
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="text-xl font-bold text-gray-600">15</div>
                                    <div className="text-xs text-gray-500">신규</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">김철수</span>
                                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">VIP</span>
                                    </div>
                                    <div className="flex space-x-1 mb-1">
                                        {[...Array(9)].map((_, i) => (
                                            <StarIcon key={i} className="w-3 h-3 text-orange-500 fill-current" />
                                        ))}
                                        <StarIcon className="w-3 h-3 text-gray-300" />
                                    </div>
                                    <div className="text-sm text-gray-500">9/10 스탬프 • 9회 방문</div>
                                </div>

                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">이영희</span>
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">단골</span>
                                    </div>
                                    <div className="flex space-x-1 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i} className="w-3 h-3 text-orange-500 fill-current" />
                                        ))}
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon key={i+5} className="w-3 h-3 text-gray-300" />
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-500">5/10 스탬프 • 5회 방문</div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                                    스탬프 관리
                                </button>
                                <button className="px-4 py-2 bg-white text-orange-600 border border-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                                    이벤트
                                </button>
                            </div>
                        </div>
                    </GridBlock>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <GridBlock
                        title="🎯 포털 이벤트"
                        icon={<TrophyIcon className="w-6 h-6" />}
                        className="bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200"
                    >
                        <div className="space-y-3">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                                    <span>🏆</span>
                                    <span>369 이벤트</span>
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">참여고객</span>
                                        <span className="font-bold text-purple-600">24명</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">달성률</span>
                                        <span className="font-bold text-purple-600">67%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <motion.div
                                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: "67%" }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">추가 매출</span>
                                    <span className="font-bold text-green-600">+340,000원</span>
                                </div>
                            </div>

                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-indigo-600">8</div>
                                        <div className="text-xs text-gray-500">VIP 고객</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-purple-600">5%</div>
                                        <div className="text-xs text-gray-500">VIP 할인</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                                    이벤트 현황
                                </button>
                                <button className="px-4 py-2 bg-white text-purple-600 border border-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                                    통계
                                </button>
                            </div>
                        </div>
                    </GridBlock>
                </motion.div>

                {/* 세 번째 줄: 갤러리 + 리뷰 */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <GridBlock
                        title="📷 매장 사진"
                        icon={<CameraIcon className="w-6 h-6" />}
                        className="bg-gradient-to-br from-pink-50 to-rose-100 border-pink-200"
                    >
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                {[1,2,3,4].map(i => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ scale: 1.05 }}
                                        className="bg-gradient-to-br from-gray-100 to-gray-200 h-20 rounded-lg flex items-center justify-center group hover:from-gray-200 hover:to-gray-300 transition-all duration-200 cursor-pointer"
                                    >
                                        <CameraIcon className="w-6 h-6 text-gray-400 group-hover:text-gray-500 transition-colors" />
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <div className="text-lg font-bold text-pink-600">4</div>
                                        <div className="text-xs text-gray-500">메뉴</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-pink-600">2</div>
                                        <div className="text-xs text-gray-500">실내</div>
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-pink-600">12</div>
                                        <div className="text-xs text-gray-500">총 사진</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-pink-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors">
                                    사진 업로드
                                </button>
                                <button className="px-4 py-2 bg-white text-pink-600 border border-pink-600 rounded-lg text-sm font-medium hover:bg-pink-50 transition-colors">
                                    편집
                                </button>
                            </div>
                        </div>
                    </GridBlock>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <GridBlock
                        title="⭐ 리뷰"
                        icon={<StarIcon className="w-6 h-6" />}
                        className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200"
                    >
                        <div className="space-y-3">
                            <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                                <div className="flex items-center justify-center space-x-2 mb-3">
                                    <span className="text-3xl font-bold text-yellow-600">4.2</span>
                                    <div className="flex">
                                        {[...Array(4)].map((_, i) => (
                                            <StarIcon key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                                        ))}
                                        <StarIcon className="w-5 h-5 text-gray-300" />
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500">24개 리뷰</div>
                            </div>

                            <div className="space-y-2">
                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">이영희</span>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        음식이 정말 맛있고 서비스도 친절했어요! 특히 불고기정식이 일품입니다.
                                    </p>
                                    <div className="text-xs text-gray-400 mt-1">2일 전</div>
                                </div>

                                <div className="bg-white p-3 rounded-lg shadow-sm">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-medium">박민수</span>
                                        <div className="flex">
                                            {[...Array(4)].map((_, i) => (
                                                <StarIcon key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                                            ))}
                                            <StarIcon className="w-3 h-3 text-gray-300" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        분위기 좋고 음식도 괜찮았습니다. 가족 모임하기 좋네요.
                                    </p>
                                    <div className="text-xs text-gray-400 mt-1">5일 전</div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button className="flex-1 bg-yellow-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors">
                                    리뷰 관리
                                </button>
                                <button className="px-4 py-2 bg-white text-yellow-600 border border-yellow-600 rounded-lg text-sm font-medium hover:bg-yellow-50 transition-colors">
                                    답글
                                </button>
                            </div>
                        </div>
                    </GridBlock>
                </motion.div>

            </div>

            {/* 하단 상태바 */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-8 flex flex-wrap justify-center items-center gap-4 text-sm text-gray-500 bg-white p-4 rounded-lg shadow-sm"
            >
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>실시간 연결됨</span>
                </div>
                <span>•</span>
                <span>총 예약: <strong>8건</strong></span>
                <span>•</span>
                <span>등록 고객: <strong>26명</strong></span>
                <span>•</span>
                <span>평점: <strong>⭐ 4.2</strong></span>
                <span>•</span>
                <span>Next.js 13 App Router</span>
            </motion.div>
        </div>
    )
}

export default TestDashboard