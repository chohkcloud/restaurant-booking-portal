'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Category } from '@/types/restaurant'
import styles from './CategoryGrid.module.css'

interface CategoryGridProps {
  categories: Category[]
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const router = useRouter()

  const handleCategoryClick = (slug: string) => {
    router.push(`/restaurants?category=${slug}`)
  }

  return (
    <div className={styles.gridContainer}>
      {categories.map((category, index) => (
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
    </div>
  )
}

export default CategoryGrid