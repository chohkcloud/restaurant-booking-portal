'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import type { Category } from '@/types/restaurant'
import styles from './CategoryGrid.module.css'

interface CategoryGridProps {
  categories: Category[]
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCategoryClick = (slug: string) => {
    router.push(`/restaurants?category=${slug}`)
  }

  // 모바일에서는 기본적으로 9개만 표시 (2줄 x 5개 - 마지막 하나는 펼치기 버튼)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const displayedCategories = isMobile && !isExpanded ? categories.slice(0, 9) : categories

  return (

      <div 
        className={styles.gridContainer}
      >
        {displayedCategories.map((category, index) => (
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
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
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
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
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
  )
}

export default CategoryGrid