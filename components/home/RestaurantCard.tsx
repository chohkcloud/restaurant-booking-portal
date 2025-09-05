'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { StarIcon } from '@heroicons/react/24/solid'
import { ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'
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
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1"
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
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            추천
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold">
          {restaurant.category?.name}
        </div>
      </div>

      {/* 정보 */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 text-gray-800">{restaurant.name}</h3>
        
        {/* 평점 및 리뷰 */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400" />
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
            <MapPinIcon className="w-3 h-3 mr-1" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>
        )}

        {/* 배달/포장 옵션 */}
        <div className="flex gap-2 mt-3">
          {restaurant.delivery_enabled && (
            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
              배달
            </span>
          )}
          {restaurant.takeout_enabled && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
              포장
            </span>
          )}
          {restaurant.reservation_enabled && (
            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded">
              예약
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard