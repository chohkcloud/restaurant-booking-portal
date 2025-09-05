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
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fff1ee 0%, #ffe4de 100%)'
    }}>
      {/* 헤더 */}
      <div style={{ 
        background: 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
        boxShadow: '0 2px 10px rgba(255, 107, 53, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 
              onClick={() => router.push('/')}
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'white',
                cursor: 'pointer',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLHeadingElement
                target.style.opacity = '0.8'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLHeadingElement
                target.style.opacity = '1'
              }}
            >
              🍽️ 맛집 예약 포털
            </h1>
            
            {/* 검색 바 */}
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '600px', margin: '0 2rem' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="음식이나 레스토랑을 검색하세요..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 3rem',
                    borderRadius: '2rem',
                    border: '2px solid rgba(255,255,255,0.3)',
                    background: 'rgba(255,255,255,0.95)',
                    fontSize: '1rem',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLInputElement
                    target.style.transform = 'translateY(-1px)'
                    target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.2)'
                    target.style.borderColor = 'rgba(255,255,255,0.5)'
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLInputElement
                    target.style.transform = 'translateY(0)'
                    target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'
                    target.style.borderColor = 'rgba(255,255,255,0.3)'
                  }}
                />
                <MagnifyingGlassIcon style={{ 
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '1.25rem',
                  height: '1.25rem',
                  color: '#9CA3AF'
                }} />
                <button
                  type="submit"
                  style={{
                    position: 'absolute',
                    right: '0.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
                    color: 'white',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '1.5rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement
                    target.style.transform = 'translateY(-50%) scale(1.05)'
                    target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement
                    target.style.transform = 'translateY(-50%) scale(1)'
                    target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.3)'
                  }}
                >
                  검색
                </button>
              </div>
            </form>

            {/* 필터 버튼 */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(255,255,255,0.3)'
                target.style.borderColor = 'rgba(255,255,255,0.5)'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(255,255,255,0.2)'
                target.style.borderColor = 'rgba(255,255,255,0.3)'
              }}
            >
              <FunnelIcon style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>필터</span>
            </button>
          </div>

          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            <button
              onClick={() => handleCategoryChange('')}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                border: 'none',
                cursor: 'pointer',
                background: !selectedCategory 
                  ? 'rgba(255,255,255,0.95)' 
                  : 'rgba(255,255,255,0.3)',
                color: !selectedCategory 
                  ? '#ff6b35' 
                  : 'rgba(255,255,255,0.9)',
                boxShadow: !selectedCategory 
                  ? '0 2px 8px rgba(255, 107, 53, 0.3)' 
                  : 'none'
              }}
            >
              전체
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === category.slug
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.3)',
                  color: selectedCategory === category.slug
                    ? '#ff6b35'
                    : 'rgba(255,255,255,0.9)',
                  boxShadow: selectedCategory === category.slug
                    ? '0 2px 8px rgba(255, 107, 53, 0.3)'
                    : 'none'
                }}
              >
                <span style={{ marginRight: '0.25rem' }}>{category.icon}</span>
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
          style={{
            background: 'white',
            borderBottom: '1px solid rgba(255, 107, 53, 0.1)',
            boxShadow: '0 2px 10px rgba(255, 107, 53, 0.1)'
          }}
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
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            {currentCategory && (
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: '#ff6b35',
                textShadow: '0 2px 4px rgba(255, 107, 53, 0.1)'
              }}>
                <span style={{ marginRight: '0.5rem' }}>{currentCategory.icon}</span>
                {currentCategory.name} 맛집
              </h2>
            )}
            {searchQuery && (
              <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.5rem' }}>
                &quot;{searchQuery}&quot; 검색 결과
              </p>
            )}
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginTop: '0.25rem' }}>
              총 {restaurants.length}개 매장
            </p>
          </div>
        </div>

        {/* 레스토랑 목록 */}
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            padding: '3rem 0'
          }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              border: '3px solid #ffe4de',
              borderTop: '3px solid #ff6b35',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : restaurants.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ 
              color: '#6B7280', 
              fontSize: '1.125rem',
              marginBottom: '1rem'
            }}>
              검색 결과가 없습니다.
            </p>
            <button
              onClick={clearFilters}
              style={{
                color: '#ff6b35',
                fontWeight: '600',
                background: 'rgba(255, 107, 53, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(255, 107, 53, 0.2)'
                target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(255, 107, 53, 0.1)'
                target.style.transform = 'translateY(0)'
              }}
            >
              필터 초기화하기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}