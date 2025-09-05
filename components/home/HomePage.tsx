'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline'
import CategoryGrid from './CategoryGrid'
import RestaurantCard from './RestaurantCard'
import { getCategories, getFeaturedRestaurants } from '@/lib/restaurants'
import type { Category, Restaurant } from '@/types/restaurant'

const HomePage = () => {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [featuredRestaurants, setFeaturedRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesResult, restaurantsResult] = await Promise.all([
        getCategories(),
        getFeaturedRestaurants()
      ])

      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
      }

      if (restaurantsResult.success) {
        setFeaturedRestaurants(restaurantsResult.restaurants)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/restaurants?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 배너 */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-2">🍽️ 맛집 예약 포털</h1>
            <p className="text-lg opacity-90">원하는 음식을 검색하고 예약하세요!</p>
          </motion.div>

          {/* 검색 바 */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="mt-6 max-w-2xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="음식이나 레스토랑을 검색하세요..."
                className="w-full px-12 py-4 rounded-full text-gray-800 text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
              />
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                검색
              </button>
            </div>
          </motion.form>

          {/* 위치 표시 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mt-4 text-sm"
          >
            <MapPinIcon className="w-4 h-4 mr-1" />
            <span>현재 위치: 서울특별시 강남구</span>
          </motion.div>
        </div>
      </div>

      {/* 카테고리 섹션 */}
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 px-4 mb-4">카테고리별 맛집</h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <CategoryGrid categories={categories} />
          )}
        </motion.div>
      </div>

      {/* 추천 레스토랑 섹션 */}
      <div className="max-w-7xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center px-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">추천 맛집</h2>
            <button
              onClick={() => router.push('/restaurants')}
              className="text-orange-500 hover:text-orange-600 font-semibold text-sm"
            >
              전체보기 →
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4">
              {featuredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* 푸터 */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm opacity-75">© 2025 맛집 예약 포털. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default HomePage