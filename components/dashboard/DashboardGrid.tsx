'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface DashboardGridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4
}

export function DashboardGrid({ children, cols = 3 }: DashboardGridProps) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${colClasses[cols]} gap-6`}>
      {children}
    </div>
  )
}

interface DashboardCardProps {
  title: string
  description?: string
  children?: React.ReactNode
  action?: React.ReactNode
}

export function DashboardCard({ title, description, children, action }: DashboardCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {action}
      </div>
      {description && (
        <p className="text-gray-600 mb-4">{description}</p>
      )}
      {children}
    </div>
  )
}

// GridBlock 컴포넌트 (TestDashboard에서 사용)
interface GridBlockProps {
  title: string
  icon?: React.ReactNode
  className?: string
  children: React.ReactNode
}

const GridBlock: React.FC<GridBlockProps> = ({
  title,
  icon,
  className = '',
  children
}) => {
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full
        transition-all duration-300 cursor-pointer hover:border-gray-300
        ${className}
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          {icon && <span className="text-blue-600">{icon}</span>}
          <span>{title}</span>
        </h3>
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      </div>

      <div className="h-[calc(100%-4rem)]">
        {children}
      </div>
    </motion.div>
  )
}

export default GridBlock