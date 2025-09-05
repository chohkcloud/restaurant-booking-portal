'use client'

import React, { useState, useEffect } from 'react'
import { BuildingStorefrontIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { getAuthHeaders } from '@/lib/adminAuth'

interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  image_url: string | null
  is_available: boolean
  is_recommended: boolean
  ingredients: string[]
  allergens: string[]
  spice_level: number
  cooking_time: number | null
  calories: number | null
  display_order: number
  created_at: string
  updated_at: string
}

interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    is_available: true,
    is_recommended: false,
    ingredients: '',
    allergens: '',
    spice_level: 0,
    cooking_time: '',
    calories: ''
  })

  // 카테고리 폼 상태
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    display_order: 0
  })

  // 데이터 로딩
  useEffect(() => {
    fetchMenuData()
  }, [])

  const fetchMenuData = async () => {
    try {
      const headers = getAuthHeaders()
      
      // 메뉴 아이템과 카테고리를 병렬로 로딩
      const [menuResponse, categoryResponse] = await Promise.all([
        fetch('/api/admin/menu/items', { headers }),
        fetch('/api/admin/menu/categories', { headers })
      ])

      if (menuResponse.ok) {
        const menuData = await menuResponse.json()
        setMenuItems(menuData.items || [])
      }

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json()
        setCategories(categoryData.categories || [])
      }
    } catch (error) {
      console.error('메뉴 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      image_url: '',
      is_available: true,
      is_recommended: false,
      ingredients: '',
      allergens: '',
      spice_level: 0,
      cooking_time: '',
      calories: ''
    })
  }

  // 메뉴 아이템 추가
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }

      const payload = {
        ...formData,
        price: parseInt(formData.price),
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(s => s),
        allergens: formData.allergens.split(',').map(s => s.trim()).filter(s => s),
        cooking_time: formData.cooking_time ? parseInt(formData.cooking_time) : null,
        calories: formData.calories ? parseInt(formData.calories) : null
      }

      const response = await fetch('/api/admin/menu/items', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchMenuData()
        setShowAddModal(false)
        resetForm()
        alert('메뉴 아이템이 추가되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('메뉴 추가 실패:', error)
      alert('메뉴 추가 중 오류가 발생했습니다.')
    }
  }

  // 메뉴 아이템 수정
  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingItem) return

    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }

      const payload = {
        ...formData,
        price: parseInt(formData.price),
        ingredients: formData.ingredients.split(',').map(s => s.trim()).filter(s => s),
        allergens: formData.allergens.split(',').map(s => s.trim()).filter(s => s),
        cooking_time: formData.cooking_time ? parseInt(formData.cooking_time) : null,
        calories: formData.calories ? parseInt(formData.calories) : null
      }

      const response = await fetch(`/api/admin/menu/items/${editingItem.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchMenuData()
        setShowEditModal(false)
        setEditingItem(null)
        resetForm()
        alert('메뉴 아이템이 수정되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('메뉴 수정 실패:', error)
      alert('메뉴 수정 중 오류가 발생했습니다.')
    }
  }

  // 메뉴 아이템 삭제
  const handleDeleteItem = async (id: string) => {
    if (!confirm('정말로 이 메뉴를 삭제하시겠습니까?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/menu/items/${id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        await fetchMenuData()
        alert('메뉴 아이템이 삭제되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('메뉴 삭제 실패:', error)
      alert('메뉴 삭제 중 오류가 발생했습니다.')
    }
  }

  // 수정 모달 열기
  const openEditModal = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id || '',
      image_url: item.image_url || '',
      is_available: item.is_available,
      is_recommended: item.is_recommended,
      ingredients: item.ingredients.join(', '),
      allergens: item.allergens.join(', '),
      spice_level: item.spice_level,
      cooking_time: item.cooking_time?.toString() || '',
      calories: item.calories?.toString() || ''
    })
    setShowEditModal(true)
  }

  // 카테고리 추가
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }

      const response = await fetch('/api/admin/menu/categories', {
        method: 'POST',
        headers,
        body: JSON.stringify(categoryForm)
      })

      if (response.ok) {
        await fetchMenuData()
        setShowCategoryModal(false)
        setCategoryForm({ name: '', display_order: 0 })
        alert('카테고리가 추가되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('카테고리 추가 실패:', error)
      alert('카테고리 추가 중 오류가 발생했습니다.')
    }
  }

  // 필터링된 메뉴 아이템
  const filteredMenuItems = menuItems.filter(item => 
    selectedCategory === 'all' || item.category_id === selectedCategory
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">메뉴 데이터를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">메뉴 관리</h2>
          <p className="text-gray-600">메뉴 아이템과 카테고리를 관리하세요.</p>
        </div>
        <div className="flex space-x-3">
          <Button
            onClick={() => setShowCategoryModal(true)}
            variant="secondary"
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            카테고리 추가
          </Button>
          <Button
            onClick={() => {
              resetForm()
              setShowAddModal(true)
            }}
            className="flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            메뉴 추가
          </Button>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            selectedCategory === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 ({menuItems.length})
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name} ({menuItems.filter(item => item.category_id === category.id).length})
          </button>
        ))}
      </div>

      {/* 메뉴 리스트 */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredMenuItems.length === 0 ? (
          <div className="text-center py-12">
            <BuildingStorefrontIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
            <Button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              className="mt-4"
            >
              첫 번째 메뉴 추가하기
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      {item.is_recommended && (
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          추천
                        </span>
                      )}
                      {!item.is_available && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                          품절
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="font-semibold text-blue-600">
                        ₩{item.price.toLocaleString()}
                      </span>
                      
                      {item.spice_level > 0 && (
                        <span>🌶️ 맵기 {item.spice_level}단계</span>
                      )}
                      
                      {item.cooking_time && (
                        <span>⏱️ {item.cooking_time}분</span>
                      )}
                      
                      {item.calories && (
                        <span>🔥 {item.calories}kcal</span>
                      )}
                    </div>

                    {item.ingredients.length > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        재료: {item.ingredients.join(', ')}
                      </p>
                    )}

                    {item.allergens.length > 0 && (
                      <p className="text-sm text-red-600 mt-1">
                        알레르기 유발 요소: {item.allergens.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-gray-400 hover:text-blue-600"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 메뉴 추가/수정 모달 */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setEditingItem(null)
          resetForm()
        }}
        title={editingItem ? '메뉴 수정' : '새 메뉴 추가'}
      >
        <form onSubmit={editingItem ? handleEditItem : handleAddItem} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메뉴명 *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="메뉴 이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="메뉴 설명을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                가격 *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">카테고리 선택</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이미지 URL
            </label>
            <Input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              재료 (콤마로 구분)
            </label>
            <Input
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="예: 쌀, 고기, 양파, 당근"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              알레르기 유발 요소 (콤마로 구분)
            </label>
            <Input
              value={formData.allergens}
              onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
              placeholder="예: 견과류, 우유, 계란"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                맵기 정도
              </label>
              <select
                value={formData.spice_level}
                onChange={(e) => setFormData({ ...formData, spice_level: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={0}>없음</option>
                <option value={1}>1단계</option>
                <option value={2}>2단계</option>
                <option value={3}>3단계</option>
                <option value={4}>4단계</option>
                <option value={5}>5단계</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                조리 시간 (분)
              </label>
              <Input
                type="number"
                value={formData.cooking_time}
                onChange={(e) => setFormData({ ...formData, cooking_time: e.target.value })}
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                칼로리
              </label>
              <Input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                placeholder="500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">판매 중</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_recommended}
                onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">추천 메뉴</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false)
                setShowEditModal(false)
                setEditingItem(null)
                resetForm()
              }}
            >
              취소
            </Button>
            <Button type="submit">
              {editingItem ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* 카테고리 추가 모달 */}
      <Modal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false)
          setCategoryForm({ name: '', display_order: 0 })
        }}
        title="카테고리 추가"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              카테고리명 *
            </label>
            <Input
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              placeholder="예: 메인 요리, 음료, 디저트"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              표시 순서
            </label>
            <Input
              type="number"
              value={categoryForm.display_order}
              onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) })}
              placeholder="0"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCategoryModal(false)
                setCategoryForm({ name: '', display_order: 0 })
              }}
            >
              취소
            </Button>
            <Button type="submit">
              추가
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}