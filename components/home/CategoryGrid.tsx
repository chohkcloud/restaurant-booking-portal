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
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryClick(category.slug)}
          className="cursor-pointer"
        >
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-xl transition-shadow border-2 border-transparent hover:border-orange-400">
            <div className="text-4xl mb-2">{category.icon}</div>
            <h3 className="text-sm font-semibold text-gray-800 text-center">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs text-gray-500 mt-1 text-center line-clamp-2">
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