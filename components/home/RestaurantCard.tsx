'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { StarIcon } from '@heroicons/react/24/solid'
import { MapPinIcon } from '@heroicons/react/24/outline'
import type { Restaurant } from '@/types/restaurant'

interface RestaurantCardProps {
  restaurant: Restaurant
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/restaurant/${restaurant.slug}`)
  }

  const getPriceDisplay = (priceRange: string | null) => {
    if (!priceRange) return '₩'
    const priceMap: { [key: string]: string } = {
      '1': '₩',
      '2': '₩₩',
      '3': '₩₩₩',
      '4': '₩₩₩₩',
      '$': '₩',
      '$$': '₩₩',
      '$$$': '₩₩₩',
      '$$$$': '₩₩₩₩'
    }
    return priceMap[priceRange] || '₩'
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: 'white',
        borderRadius: '1.5rem',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(255, 107, 53, 0.15)',
        border: '2px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)'
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 53, 0.2)'
        e.currentTarget.style.borderColor = '#ff6b35'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(255, 107, 53, 0.15)'
        e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      {/* 이미지 */}
      <div className="relative h-48 bg-gray-200">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
            <span className="text-white text-4xl">🍽️</span>
          </div>
        )}
        {restaurant.is_featured && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
            color: 'white',
            padding: '0.375rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
          }}>
            ⭐ 추천
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          padding: '0.375rem 0.75rem',
          borderRadius: '1rem',
          fontSize: '0.75rem',
          fontWeight: '600',
          color: '#374151',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        }}>
          {restaurant.category?.name}
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-800">{restaurant.name}</h3>
        
        {/* 평점 및 리뷰 */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <StarIcon className="small-icon text-yellow-400" />
            <span className="text-sm font-semibold ml-1">{restaurant.rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-gray-500">({restaurant.total_reviews}개 리뷰)</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs font-medium">{getPriceDisplay(restaurant.price_range)}</span>
        </div>

        {/* 설명 */}
        {restaurant.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {restaurant.description}
          </p>
        )}

        {/* 위치 */}
        {restaurant.address && (
          <div className="flex items-center text-xs text-gray-500 mb-1">
            <MapPinIcon className="small-icon mr-1" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>
        )}

        {/* 배달/포장 옵션 */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
          {restaurant.delivery_enabled && (
            <span style={{
              background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
              color: 'white',
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
            }}>
              🚚 배달
            </span>
          )}
          {restaurant.takeout_enabled && (
            <span style={{
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: 'white',
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.2)'
            }}>
              🥡 포장
            </span>
          )}
          {restaurant.reservation_enabled && (
            <span style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              color: 'white',
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(255, 107, 53, 0.2)'
            }}>
              📅 예약
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard