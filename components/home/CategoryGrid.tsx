'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import type { Category } from '@/types/restaurant'

interface CategoryGridProps {
  categories: Category[]
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const router = useRouter()

  const handleCategoryClick = (slug: string) => {
    router.push(`/restaurants?category=${slug}`)
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
      gap: '1rem', 
      padding: '0 1rem' 
    }}>
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryClick(category.slug)}
          style={{ cursor: 'pointer' }}
        >
          <div style={{
            background: 'white',
            borderRadius: '1.5rem',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(255, 107, 53, 0.12)',
            border: '2px solid transparent',
            minHeight: '140px',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)'
            e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 107, 53, 0.2)'
            e.currentTarget.style.borderColor = '#ff6b35'
            e.currentTarget.style.background = 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 107, 53, 0.12)'
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.background = 'white'
          }}
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
            
            <div style={{ 
              fontSize: '2.5rem', 
              marginBottom: '0.75rem',
              userSelect: 'none',
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {category.icon}
            </div>
            <h3 style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: '#1f2937',
              textAlign: 'center',
              lineHeight: '1.3',
              marginBottom: category.description ? '0.5rem' : '0'
            }}>
              {category.name}
            </h3>
            {category.description && (
              <p style={{ 
                fontSize: '0.75rem', 
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: '1.3',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2
              }}>
                {category.description}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default CategoryGrid