'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import RestaurantCard from '@/components/home/RestaurantCard'
import { getRestaurants, getCategories } from '@/lib/restaurants'
import type { Restaurant, Category } from '@/types/restaurant'

export default function RestaurantsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categorySlug = searchParams.get('category')
  const searchQuery = searchParams.get('search')

  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || '')
  const [search, setSearch] = useState(searchQuery || '')
  const [showFilters, setShowFilters] = useState(false)
  const [priceFilter, setPriceFilter] = useState<string>('')
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating')

  useEffect(() => {
    loadData()
  }, [selectedCategory, searchQuery])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // 카테고리 로드
      const categoriesResult = await getCategories()
      if (categoriesResult.success) {
        setCategories(categoriesResult.categories)
      }

      // 레스토랑 로드
      const options: {
        categorySlug?: string;
        search?: string;
      } = {}
      if (selectedCategory) {
        options.categorySlug = selectedCategory
      }
      if (searchQuery) {
        options.search = searchQuery
      }

      const restaurantsResult = await getRestaurants(options)
      if (restaurantsResult.success) {
        let filteredRestaurants = restaurantsResult.restaurants

        // 가격 필터 적용
        if (priceFilter) {
          filteredRestaurants = filteredRestaurants.filter(r => r.price_range === priceFilter)
        }

        // 정렬 적용
        filteredRestaurants.sort((a, b) => {
          if (sortBy === 'rating') return b.rating - a.rating
          if (sortBy === 'reviews') return b.total_reviews - a.total_reviews
          if (sortBy === 'name') return a.name.localeCompare(b.name, 'ko')
          return 0
        })

        setRestaurants(filteredRestaurants)
      }
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug)
    const params = new URLSearchParams()
    if (slug) params.set('category', slug)
    if (search) params.set('search', search)
    router.push(`/restaurants${params.toString() ? '?' + params.toString() : ''}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (selectedCategory) params.set('category', selectedCategory)
    if (search) params.set('search', search)
    router.push(`/restaurants${params.toString() ? '?' + params.toString() : ''}`)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSearch('')
    setPriceFilter('')
    setSortBy('rating')
    router.push('/restaurants')
  }

  const currentCategory = categories.find(c => c.slug === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 
              onClick={() => router.push('/')}
              className="text-2xl font-bold text-orange-500 cursor-pointer hover:text-orange-600 transition-colors"
            >
              🍽️ 맛집 예약 포털
            </h1>
            
            {/* 검색 바 */}
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="음식이나 레스토랑을 검색하세요..."
                  className="w-full px-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
                >
                  검색
                </button>
              </div>
            </form>

            {/* 필터 버튼 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              <span>필터</span>
            </button>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedCategory 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.slug
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 필터 패널 */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-4">
              {/* 가격대 필터 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">가격대</label>
                <div className="flex gap-2">
                  {[{value: '1', label: '₩'}, {value: '2', label: '₩₩'}, {value: '3', label: '₩₩₩'}, {value: '4', label: '₩₩₩₩'}].map((price) => (
                    <button
                      key={price.value}
                      onClick={() => setPriceFilter(priceFilter === price.value ? '' : price.value)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        priceFilter === price.value
                          ? 'bg-orange-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {price.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 정렬 */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">정렬</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'rating' | 'reviews' | 'name')}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="rating">평점순</option>
                  <option value="reviews">리뷰 많은순</option>
                  <option value="name">이름순</option>
                </select>
              </div>

              {/* 필터 초기화 */}
              <button
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
              >
                <XMarkIcon className="w-4 h-4" />
                필터 초기화
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* 결과 정보 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            {currentCategory && (
              <h2 className="text-xl font-bold text-gray-800">
                <span className="mr-2">{currentCategory.icon}</span>
                {currentCategory.name} 맛집
              </h2>
            )}
            {searchQuery && (
              <p className="text-gray-600">
&quot;{searchQuery}&quot; 검색 결과
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              총 {restaurants.length}개 매장
            </p>
          </div>
        </div>

        {/* 레스토랑 목록 */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : restaurants.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-orange-500 hover:text-orange-600 font-semibold"
            >
              필터 초기화하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}