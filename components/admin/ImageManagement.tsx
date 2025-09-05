'use client'

import React, { useState, useEffect } from 'react'
import { PhotoIcon, PlusIcon, TrashIcon, StarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { getAuthHeaders } from '@/lib/adminAuth'

interface RestaurantImage {
  id: string
  restaurant_id: string
  image_url: string
  alt_text: string | null
  category: 'general' | 'food' | 'interior' | 'exterior' | 'menu'
  is_primary: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export default function ImageManagement() {
  const [images, setImages] = useState<RestaurantImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [uploading, setUploading] = useState(false)

  // 폼 상태
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    category: 'general' as const,
    is_primary: false
  })

  const categories = [
    { value: 'general', label: '일반', icon: '📷' },
    { value: 'food', label: '음식', icon: '🍽️' },
    { value: 'interior', label: '실내', icon: '🏠' },
    { value: 'exterior', label: '외관', icon: '🏢' },
    { value: 'menu', label: '메뉴판', icon: '📋' }
  ]

  // 데이터 로딩
  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/admin/images', { headers })

      if (response.ok) {
        const data = await response.json()
        setImages(data.images || [])
      }
    } catch (error) {
      console.error('이미지 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      image_url: '',
      alt_text: '',
      category: 'general',
      is_primary: false
    })
  }

  // 이미지 추가
  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }

      const response = await fetch('/api/admin/images', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchImages()
        setShowAddModal(false)
        resetForm()
        alert('이미지가 추가되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('이미지 추가 실패:', error)
      alert('이미지 추가 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  // 이미지 삭제
  const handleDeleteImage = async (id: string) => {
    if (!confirm('정말로 이 이미지를 삭제하시겠습니까?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/images/${id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        await fetchImages()
        alert('이미지가 삭제되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('이미지 삭제 실패:', error)
      alert('이미지 삭제 중 오류가 발생했습니다.')
    }
  }

  // 대표 이미지 설정
  const handleSetPrimary = async (id: string) => {
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }

      const response = await fetch(`/api/admin/images/${id}/primary`, {
        method: 'PUT',
        headers
      })

      if (response.ok) {
        await fetchImages()
        alert('대표 이미지가 설정되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('대표 이미지 설정 실패:', error)
      alert('대표 이미지 설정 중 오류가 발생했습니다.')
    }
  }

  // 필터링된 이미지
  const filteredImages = images.filter(image => 
    selectedCategory === 'all' || image.category === selectedCategory
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">이미지 데이터를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">매장 사진 관리</h2>
          <p className="text-gray-600">매장 사진을 업로드하고 관리하세요.</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          사진 추가
        </Button>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <span>전체 ({images.length})</span>
        </button>
        {categories.map(category => {
          const count = images.filter(img => img.category === category.value).length
          return (
            <button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                selectedCategory === category.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label} ({count})</span>
            </button>
          )
        })}
      </div>

      {/* 이미지 그리드 */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 사진이 없습니다.</p>
            <Button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              className="mt-4"
            >
              첫 번째 사진 추가하기
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || '매장 사진'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo='
                    }}
                  />
                  
                  {/* 대표 이미지 배지 */}
                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <StarSolidIcon className="h-3 w-3" />
                      <span>대표</span>
                    </div>
                  )}

                  {/* 카테고리 배지 */}
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                    {categories.find(cat => cat.value === image.category)?.icon}{' '}
                    {categories.find(cat => cat.value === image.category)?.label}
                  </div>

                  {/* 호버 액션 버튼 */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
                    {!image.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="대표 이미지로 설정"
                      >
                        <StarIcon className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="삭제"
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* 이미지 정보 */}
                <div className="mt-2">
                  {image.alt_text && (
                    <p className="text-sm text-gray-700 truncate">
                      {image.alt_text}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 이미지 추가 모달 */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          resetForm()
        }}
        title="새 사진 추가"
      >
        <form onSubmit={handleAddImage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지 URL *
            </label>
            <Input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              이미지 URL을 입력하거나 파일 업로드 기능을 추후 추가할 예정입니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 (대체 텍스트)
            </label>
            <Input
              value={formData.alt_text}
              onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
              placeholder="이미지에 대한 설명을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리 *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.icon} {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_primary}
                onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">대표 이미지로 설정</span>
            </label>
          </div>

          {/* 미리보기 */}
          {formData.image_url && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                미리보기
              </label>
              <div className="w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={formData.image_url}
                  alt="미리보기"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = ''
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false)
                resetForm()
              }}
              disabled={uploading}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={uploading || !formData.image_url}
            >
              {uploading ? '추가 중...' : '추가'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}