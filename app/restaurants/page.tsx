'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
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
  const [categoryScrollIndex, setCategoryScrollIndex] = useState(0)

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
      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
    }}>
      {/* 검색 바 */}
      <div style={{ 
        background: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <h1 
              onClick={() => router.push('/')}
              style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#22c55e',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
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
              🍽️
            </h1>
            
            {/* 검색 바 */}
            <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '600px' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="음식이나 레스토랑을 검색하세요..."
                  style={{
                    width: '100%',
                    padding: '0.75rem 4.5rem 0.75rem 2.5rem',
                    borderRadius: '2rem',
                    border: '2px solid #22c55e',
                    background: 'white',
                    fontSize: '0.8rem',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    const target = e.target as HTMLInputElement
                    target.style.transform = 'translateY(-2px)'
                    target.style.boxShadow = '0 12px 35px rgba(34, 197, 94, 0.2)'
                    target.style.borderColor = '#22c55e'
                  }}
                  onBlur={(e) => {
                    const target = e.target as HTMLInputElement
                    target.style.transform = 'translateY(0)'
                    target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'
                    target.style.borderColor = '#22c55e'
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
                    right: '0.5rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '1.5rem',
                    border: 'none',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
                    transition: 'all 0.2s ease',
                    zIndex: 2
                  }}
                  onMouseEnter={(e) => {
                    const target = e.target as HTMLButtonElement
                    target.style.transform = 'translateY(-50%) scale(1.05)'
                    target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    const target = e.target as HTMLButtonElement
                    target.style.transform = 'translateY(-50%) scale(1)'
                    target.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.3)'
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
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                border: '2px solid #22c55e',
                borderRadius: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(34, 197, 94, 0.2)'
                target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(34, 197, 94, 0.1)'
                target.style.transform = 'translateY(0)'
              }}
            >
              <FunnelIcon style={{ width: '1.125rem', height: '1.125rem' }} />
              <span>필터</span>
            </button>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div style={{ 
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        padding: '1rem',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative' }}>
          {/* 왼쪽 화살표 */}
          {categoryScrollIndex > 0 && (
            <button
              onClick={() => setCategoryScrollIndex(Math.max(0, categoryScrollIndex - 4))}
              style={{
                position: 'absolute',
                left: '-1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#22c55e',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'translateY(-50%) scale(1.1)'
                target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'translateY(-50%) scale(1)'
                target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <ChevronLeftIcon style={{ width: '1rem', height: '1rem' }} />
            </button>
          )}
          
          {/* 오른쪽 화살표 */}
          {categoryScrollIndex + 6 < categories.length + 1 && (
            <button
              onClick={() => setCategoryScrollIndex(Math.min(categories.length - 5, categoryScrollIndex + 4))}
              style={{
                position: 'absolute',
                right: '-1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#22c55e',
                border: 'none',
                borderRadius: '50%',
                width: '2rem',
                height: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                zIndex: 10
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'translateY(-50%) scale(1.1)'
                target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'translateY(-50%) scale(1)'
                target.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
            </button>
          )}
          
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            overflow: 'hidden',
            transition: 'transform 0.3s ease'
          }}>
            {[
              { id: 'all', slug: '', name: '전체', icon: '' },
              ...categories
            ].slice(categoryScrollIndex, categoryScrollIndex + 6).map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.slug)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  background: selectedCategory === category.slug
                    ? 'rgba(255,255,255,0.95)'
                    : 'rgba(255,255,255,0.3)',
                  color: selectedCategory === category.slug
                    ? '#22c55e'
                    : 'white',
                  boxShadow: selectedCategory === category.slug
                    ? '0 2px 8px rgba(0, 0, 0, 0.1)'
                    : 'none',
                  flexShrink: 0
                }}
              >
                {category.icon && <span style={{ marginRight: '0.25rem' }}>{category.icon}</span>}
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
            borderBottom: '1px solid rgba(34, 197, 94, 0.1)',
            boxShadow: '0 2px 10px rgba(34, 197, 94, 0.1)'
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
                          ? 'bg-green-500 text-white'
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
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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
                color: '#22c55e',
                textShadow: '0 2px 4px rgba(34, 197, 94, 0.1)'
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
              border: '3px solid #bbf7d0',
              borderTop: '3px solid #22c55e',
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
                color: '#22c55e',
                fontWeight: '600',
                background: 'rgba(34, 197, 94, 0.1)',
                padding: '0.75rem 1.5rem',
                borderRadius: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(34, 197, 94, 0.2)'
                target.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement
                target.style.background = 'rgba(34, 197, 94, 0.1)'
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