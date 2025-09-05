'use client'

import React, { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import MenuManagement from './MenuManagement'
import ImageManagement from './ImageManagement'
import EventManagement from './EventManagement'
import { 
  BuildingStorefrontIcon, 
  PhotoIcon, 
  CalendarIcon, 
  ChartBarIcon, 
  UsersIcon, 
  ClockIcon 
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalMenuItems: number
  totalImages: number
  activeEvents: number
  totalReservations: number
  totalReviews: number
  averageRating: number
}

export default function AdminDashboard() {
  const { admin } = useAdminAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats>({
    totalMenuItems: 0,
    totalImages: 0,
    activeEvents: 0,
    totalReservations: 0,
    totalReviews: 0,
    averageRating: 0
  })

  // 통계 데이터 로딩 (임시 데모 데이터)
  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    setStats({
      totalMenuItems: 24,
      totalImages: 18,
      activeEvents: 3,
      totalReservations: 142,
      totalReviews: 89,
      averageRating: 4.3
    })
  }, [])

  const dashboardCards = [
    {
      title: '메뉴 관리',
      description: '메뉴 등록, 수정, 삭제',
      icon: BuildingStorefrontIcon,
      count: stats.totalMenuItems,
      color: 'bg-blue-500',
      tab: 'menu'
    },
    {
      title: '매장 사진',
      description: '사진 업로드 및 관리',
      icon: PhotoIcon,
      count: stats.totalImages,
      color: 'bg-green-500',
      tab: 'images'
    },
    {
      title: '이벤트',
      description: '이벤트 등록 및 관리',
      icon: CalendarIcon,
      count: stats.activeEvents,
      color: 'bg-purple-500',
      tab: 'events'
    },
    {
      title: '예약 현황',
      description: '총 예약 건수',
      icon: ClockIcon,
      count: stats.totalReservations,
      color: 'bg-orange-500',
      tab: 'reservations'
    },
    {
      title: '리뷰 관리',
      description: '고객 리뷰 현황',
      icon: UsersIcon,
      count: stats.totalReviews,
      color: 'bg-pink-500',
      tab: 'reviews'
    },
    {
      title: '통계',
      description: `평균 평점: ${stats.averageRating}점`,
      icon: ChartBarIcon,
      count: null,
      color: 'bg-indigo-500',
      tab: 'statistics'
    }
  ]

  const tabs = [
    { id: 'overview', label: '대시보드 개요' },
    { id: 'menu', label: '메뉴 관리' },
    { id: 'images', label: '매장 사진' },
    { id: 'events', label: '이벤트' },
    { id: 'reservations', label: '예약 현황' },
    { id: 'reviews', label: '리뷰 관리' },
    { id: 'statistics', label: '통계' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <div
                  key={index}
                  onClick={() => setActiveTab(card.tab)}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className={`${card.color} rounded-lg p-3 mr-4`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {card.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {card.description}
                        </p>
                        {card.count !== null && (
                          <p className="text-2xl font-bold text-gray-900 mt-2">
                            {card.count}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      
      case 'menu':
        return <MenuManagement />
      
      case 'images':
        return <ImageManagement />
      
      case 'events':
        return <EventManagement />
      
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-12 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-4" />
              <p>해당 기능을 구현 중입니다...</p>
              <p className="text-sm mt-2">곧 더 많은 관리 기능을 이용하실 수 있습니다.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 탭 네비게이션 */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      {renderTabContent()}
    </div>
  )
}