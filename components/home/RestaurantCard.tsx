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
        boxShadow: '0 10px 30px rgba(34, 197, 94, 0.15)',
        border: '2px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: 'translateY(0)'
      }}
      onMouseEnter={(e) => {
        const target = e.currentTarget as HTMLDivElement
        target.style.transform = 'translateY(-8px)'
        target.style.boxShadow = '0 20px 40px rgba(34, 197, 94, 0.2)'
        target.style.borderColor = '#22c55e'
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLDivElement
        target.style.transform = 'translateY(0)'
        target.style.boxShadow = '0 10px 30px rgba(34, 197, 94, 0.15)'
        target.style.borderColor = 'transparent'
      }}
    >
      {/* 이미지 */}
      <div className="relative h-36 bg-gray-200">
        {restaurant.image_url ? (
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600">
            <span className="text-white text-4xl">🍽️</span>
          </div>
        )}
        {restaurant.is_featured && (
          <div style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            padding: '0.375rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)'
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
      <div style={{ padding: '1rem' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.5rem', color: '#1f2937' }}>{restaurant.name}</h3>
        
        {/* 평점 및 리뷰 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <StarIcon style={{ width: '1rem', height: '1rem', color: '#FBBF24' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: '600', marginLeft: '0.25rem' }}>{restaurant.rating.toFixed(1)}</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>({restaurant.total_reviews}개 리뷰)</span>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>•</span>
          <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{getPriceDisplay(restaurant.price_range)}</span>
        </div>

        {/* 설명 */}
        {restaurant.description && (
          <p style={{ 
            fontSize: '0.875rem', 
            color: '#4B5563', 
            marginBottom: '0.5rem',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4'
          }}>
            {restaurant.description}
          </p>
        )}

        {/* 위치 */}
        {restaurant.address && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '0.75rem', 
            color: '#6B7280', 
            marginBottom: '0.5rem' 
          }}>
            <MapPinIcon style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem', flexShrink: 0 }} />
            <span style={{ 
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>{restaurant.address}</span>
          </div>
        )}

        {/* 배달/포장 옵션 */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
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
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              fontSize: '0.75rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '1rem',
              fontWeight: '500',
              boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)'
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