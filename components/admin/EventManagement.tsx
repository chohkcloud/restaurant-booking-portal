'use client'

import React, { useState, useEffect } from 'react'
import { CalendarIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { getAuthHeaders } from '@/lib/adminAuth'

interface Event {
  id: string
  restaurant_id: string
  title: string
  description: string
  event_type: 'promotion' | 'discount' | 'new_menu' | 'special_event'
  discount_rate: number
  discount_amount: number
  start_date: string
  end_date: string
  start_time: string | null
  end_time: string | null
  image_url: string | null
  is_active: boolean
  max_participants: number | null
  current_participants: number
  conditions: string | null
  created_at: string
  updated_at: string
}

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [selectedType, setSelectedType] = useState<string>('all')

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'promotion' as const,
    discount_rate: 0,
    discount_amount: 0,
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    image_url: '',
    is_active: true,
    max_participants: '',
    conditions: ''
  })

  const eventTypes = [
    { value: 'promotion', label: '프로모션', icon: '🎉', color: 'bg-pink-100 text-pink-800' },
    { value: 'discount', label: '할인', icon: '💰', color: 'bg-green-100 text-green-800' },
    { value: 'new_menu', label: '신메뉴', icon: '🍽️', color: 'bg-blue-100 text-blue-800' },
    { value: 'special_event', label: '특별 이벤트', icon: '⭐', color: 'bg-purple-100 text-purple-800' }
  ]

  // 데이터 로딩
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const headers = getAuthHeaders()
      const response = await fetch('/api/admin/events', { headers })

      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('이벤트 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      event_type: 'promotion',
      discount_rate: 0,
      discount_amount: 0,
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      image_url: '',
      is_active: true,
      max_participants: '',
      conditions: ''
    })
  }

  // 이벤트 추가
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }

      const payload = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      }

      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchEvents()
        setShowAddModal(false)
        resetForm()
        alert('이벤트가 추가되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('이벤트 추가 실패:', error)
      alert('이벤트 추가 중 오류가 발생했습니다.')
    }
  }

  // 이벤트 수정
  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingEvent) return

    try {
      const headers = {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }

      const payload = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null
      }

      const response = await fetch(`/api/admin/events/${editingEvent.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        await fetchEvents()
        setShowEditModal(false)
        setEditingEvent(null)
        resetForm()
        alert('이벤트가 수정되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('이벤트 수정 실패:', error)
      alert('이벤트 수정 중 오류가 발생했습니다.')
    }
  }

  // 이벤트 삭제
  const handleDeleteEvent = async (id: string) => {
    if (!confirm('정말로 이 이벤트를 삭제하시겠습니까?')) return

    try {
      const headers = getAuthHeaders()
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers
      })

      if (response.ok) {
        await fetchEvents()
        alert('이벤트가 삭제되었습니다.')
      } else {
        const error = await response.json()
        alert(`오류: ${error.message}`)
      }
    } catch (error) {
      console.error('이벤트 삭제 실패:', error)
      alert('이벤트 삭제 중 오류가 발생했습니다.')
    }
  }

  // 수정 모달 열기
  const openEditModal = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      discount_rate: event.discount_rate,
      discount_amount: event.discount_amount,
      start_date: event.start_date,
      end_date: event.end_date,
      start_time: event.start_time || '',
      end_time: event.end_time || '',
      image_url: event.image_url || '',
      is_active: event.is_active,
      max_participants: event.max_participants?.toString() || '',
      conditions: event.conditions || ''
    })
    setShowEditModal(true)
  }

  // 이벤트 상태 확인
  const getEventStatus = (event: Event) => {
    const now = new Date()
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)

    if (!event.is_active) return { status: 'inactive', label: '비활성', color: 'bg-gray-100 text-gray-600' }
    if (now < startDate) return { status: 'upcoming', label: '예정', color: 'bg-blue-100 text-blue-800' }
    if (now > endDate) return { status: 'ended', label: '종료', color: 'bg-red-100 text-red-800' }
    return { status: 'active', label: '진행중', color: 'bg-green-100 text-green-800' }
  }

  // 필터링된 이벤트
  const filteredEvents = events.filter(event => 
    selectedType === 'all' || event.event_type === selectedType
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">이벤트 데이터를 불러오는 중...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">이벤트 관리</h2>
          <p className="text-gray-600">매장 이벤트와 프로모션을 관리하세요.</p>
        </div>
        <Button
          onClick={() => {
            resetForm()
            setShowAddModal(true)
          }}
          className="flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          이벤트 추가
        </Button>
      </div>

      {/* 타입 필터 */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            selectedType === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          전체 ({events.length})
        </button>
        {eventTypes.map(type => {
          const count = events.filter(event => event.event_type === type.value).length
          return (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-1 ${
                selectedType === type.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label} ({count})</span>
            </button>
          )
        })}
      </div>

      {/* 이벤트 리스트 */}
      <div className="bg-white rounded-lg shadow-sm border">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">등록된 이벤트가 없습니다.</p>
            <Button
              onClick={() => {
                resetForm()
                setShowAddModal(true)
              }}
              className="mt-4"
            >
              첫 번째 이벤트 추가하기
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => {
              const status = getEventStatus(event)
              const typeInfo = eventTypes.find(t => t.value === event.event_type)

              return (
                <div key={event.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {event.title}
                        </h3>
                        
                        <span className={`px-2 py-1 text-xs rounded-full ${typeInfo?.color}`}>
                          {typeInfo?.icon} {typeInfo?.label}
                        </span>
                        
                        <span className={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-3">{event.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <span>📅 {event.start_date} ~ {event.end_date}</span>
                        
                        {event.start_time && event.end_time && (
                          <span>⏰ {event.start_time} ~ {event.end_time}</span>
                        )}

                        {event.discount_rate > 0 && (
                          <span className="text-red-600 font-semibold">
                            💰 {event.discount_rate}% 할인
                          </span>
                        )}

                        {event.discount_amount > 0 && (
                          <span className="text-red-600 font-semibold">
                            💰 {event.discount_amount.toLocaleString()}원 할인
                          </span>
                        )}

                        {event.max_participants && (
                          <span>
                            👥 {event.current_participants}/{event.max_participants}명
                          </span>
                        )}
                      </div>

                      {event.conditions && (
                        <p className="text-sm text-blue-600 mt-2">
                          📋 조건: {event.conditions}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openEditModal(event)}
                        className="p-2 text-gray-400 hover:text-blue-600"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 이벤트 추가/수정 모달 */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false)
          setShowEditModal(false)
          setEditingEvent(null)
          resetForm()
        }}
        title={editingEvent ? '이벤트 수정' : '새 이벤트 추가'}
      >
        <form onSubmit={editingEvent ? handleEditEvent : handleAddEvent} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이벤트 제목 *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="이벤트 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              설명 *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="이벤트 설명을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이벤트 유형 *
              </label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                할인률 (%)
              </label>
              <Input
                type="number"
                value={formData.discount_rate}
                onChange={(e) => setFormData({ ...formData, discount_rate: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                할인 금액 (원)
              </label>
              <Input
                type="number"
                value={formData.discount_amount}
                onChange={(e) => setFormData({ ...formData, discount_amount: parseInt(e.target.value) || 0 })}
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작일 *
              </label>
              <Input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료일 *
              </label>
              <Input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                시작 시간
              </label>
              <Input
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                종료 시간
              </label>
              <Input
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              최대 참가자 수
            </label>
            <Input
              type="number"
              value={formData.max_participants}
              onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
              placeholder="제한 없음"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이벤트 조건
            </label>
            <Input
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
              placeholder="예: 2인 이상 주문시, 1만원 이상 주문시"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">이벤트 활성화</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowAddModal(false)
                setShowEditModal(false)
                setEditingEvent(null)
                resetForm()
              }}
            >
              취소
            </Button>
            <Button type="submit">
              {editingEvent ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}