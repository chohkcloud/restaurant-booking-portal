'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import type { Category } from '@/types/restaurant'
import styles from './CategoryGrid.module.css'

interface CategoryGridProps {
  categories: Category[]
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // 초기 설정
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCategoryClick = (slug: string) => {
    router.push(`/restaurants?category=${slug}`)
  }

  // PC에서는 다른 로직 사용
  const displayedCategories = isMobile && !isExpanded ? categories.slice(0, 9) : categories
  
  // PC에서 슬라이드 함수
  const slideLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 8) // 8개씩 이동
    }
  }

  const slideRight = () => {
    if (currentIndex + 16 < categories.length) {
      setCurrentIndex(currentIndex + 8) // 8개씩 이동
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      {/* PC에서만 좌우 화살표 버튼 */}
      {!isMobile && categories.length > 16 && (
        <>
          {/* 왼쪽 화살표 */}
          <button
            onClick={slideLeft}
            disabled={currentIndex === 0}
            style={{
              position: 'absolute',
              left: '-2.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: currentIndex === 0 ? 'rgba(255, 107, 53, 0.3)' : 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              if (currentIndex > 0) {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'translateY(-50%) scale(1.1)'
                target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.transform = 'translateY(-50%) scale(1)'
              target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
            }}
          >
            <ChevronLeftIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>

          {/* 오른쪽 화살표 */}
          <button
            onClick={slideRight}
            disabled={currentIndex + 16 >= categories.length}
            style={{
              position: 'absolute',
              right: '-2.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: currentIndex + 16 >= categories.length ? 'rgba(255, 107, 53, 0.3)' : 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentIndex + 16 >= categories.length ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)',
              transition: 'all 0.3s ease',
              zIndex: 10
            }}
            onMouseEnter={(e) => {
              if (currentIndex + 16 < categories.length) {
                const target = e.target as HTMLButtonElement
                target.style.transform = 'translateY(-50%) scale(1.1)'
                target.style.boxShadow = '0 6px 20px rgba(255, 107, 53, 0.4)'
              }
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.transform = 'translateY(-50%) scale(1)'
              target.style.boxShadow = '0 4px 15px rgba(255, 107, 53, 0.3)'
            }}
          >
            <ChevronRightIcon style={{ width: '1.25rem', height: '1.25rem' }} />
          </button>
        </>
      )}

      <div 
        ref={scrollRef}
        className={styles.gridContainer}
        style={{
          ...(isMobile ? {} : {
            overflow: 'hidden',
            transform: `translateX(-${currentIndex * (100 / 16)}%)`
          })
        }}
      >
        {(isMobile ? displayedCategories : categories).map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryClick(category.slug)}
            className={styles.categoryCard}
          >
            {/* 배경 장식 */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '-10px',
              width: '40px',
              height: '40px',
              background: 'radial-gradient(circle, rgba(255, 107, 53, 0.1) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            
            <div className={styles.categoryIcon}>
              {category.icon}
            </div>
            <h3 className={styles.categoryName}>
              {category.name}
            </h3>
          </motion.div>
        ))}
        
        {/* 모바일에서만 폼치기/접기 버튼 표시 */}
        {isMobile && categories.length > 9 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={styles.categoryCard}
            style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              color: 'white'
            }}
          >
            <div className={styles.categoryIcon}>
              {isExpanded ? <ChevronUpIcon style={{ width: '1.5rem', height: '1.5rem' }} /> : <ChevronDownIcon style={{ width: '1.5rem', height: '1.5rem' }} />}
            </div>
            <h3 className={styles.categoryName} style={{ color: 'white' }}>
              {isExpanded ? '접기' : '더보기'}
            </h3>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CategoryGrid