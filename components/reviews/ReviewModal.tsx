'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { XMarkIcon, CameraIcon } from '@heroicons/react/24/outline'
import { createReview, updateReview, type ReviewData } from '@/lib/reviews'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  userName?: string
  reservationId?: string
  existingReview?: ReviewData & { id: string }
  onSuccess?: () => void
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  reservationId,
  existingReview,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [ratings, setRatings] = useState({
    taste: 0,
    service: 0,
    cleanliness: 0,
    atmosphere: 0,
    parking: 0,
    revisit: 0
  })
  const [isRecommended, setIsRecommended] = useState(true)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')

  // 기존 리뷰가 있는 경우 데이터 로드
  useEffect(() => {
    if (existingReview) {
      setTitle(existingReview.title || '')
      setContent(existingReview.content)
      setRatings({
        taste: existingReview.rating_taste,
        service: existingReview.rating_service,
        cleanliness: existingReview.rating_cleanliness,
        atmosphere: existingReview.rating_atmosphere,
        parking: existingReview.rating_parking,
        revisit: existingReview.rating_revisit
      })
      setIsRecommended(existingReview.is_recommended ?? true)
      setImageUrls(existingReview.image_urls || [])
    }
  }, [existingReview])

  const handleRatingClick = (category: keyof typeof ratings, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [category]: prev[category] === rating ? rating - 1 : rating
    }))
  }

  const calculateAverageRating = () => {
    const values = Object.values(ratings)
    const sum = values.reduce((acc, val) => acc + val, 0)
    return values.length > 0 ? (sum / values.length).toFixed(1) : '0.0'
  }

  const handleAddImage = () => {
    if (newImageUrl && !imageUrls.includes(newImageUrl)) {
      setImageUrls([...imageUrls, newImageUrl])
      setNewImageUrl('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const validateForm = () => {
    // 모든 평점이 입력되었는지 확인
    const allRatingsSet = Object.values(ratings).every(rating => rating > 0)
    if (!allRatingsSet) {
      alert('모든 평점 항목을 선택해주세요.')
      return false
    }

    if (!content.trim()) {
      alert('리뷰 내용을 입력해주세요.')
      return false
    }

    if (content.trim().length < 10) {
      alert('리뷰 내용은 최소 10자 이상 입력해주세요.')
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const reviewData: ReviewData = {
        user_id: userId,
        reservation_id: reservationId,
        restaurant_name: '맛집 예약 포털',
        rating_taste: ratings.taste,
        rating_service: ratings.service,
        rating_cleanliness: ratings.cleanliness,
        rating_atmosphere: ratings.atmosphere,
        rating_parking: ratings.parking,
        rating_revisit: ratings.revisit,
        title: title.trim() || undefined,
        content: content.trim(),
        image_urls: imageUrls.length > 0 ? imageUrls : undefined,
        is_recommended: isRecommended
      }

      let result
      if (existingReview) {
        result = await updateReview(existingReview.id, userId, reviewData)
      } else {
        result = await createReview(reviewData)
      }

      if (result.success) {
        alert(existingReview ? '리뷰가 수정되었습니다!' : '리뷰가 작성되었습니다!')
        onSuccess?.()
        onClose()
        // 폼 초기화
        if (!existingReview) {
          setTitle('')
          setContent('')
          setRatings({
            taste: 0,
            service: 0,
            cleanliness: 0,
            atmosphere: 0,
            parking: 0,
            revisit: 0
          })
          setIsRecommended(true)
          setImageUrls([])
        }
      } else {
        alert(result.message || '리뷰 작성에 실패했습니다.')
      }
    } catch (error) {
      console.error('리뷰 작성 오류:', error)
      alert('리뷰 작성 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const ratingCategories = [
    { key: 'taste', label: '맛', emoji: '🍽️', description: '음식의 맛은 어떠셨나요?' },
    { key: 'service', label: '서비스', emoji: '👨‍🍳', description: '직원 서비스는 만족스러우셨나요?' },
    { key: 'cleanliness', label: '청결', emoji: '✨', description: '매장 청결도는 어떠셨나요?' },
    { key: 'atmosphere', label: '분위기', emoji: '🕯️', description: '매장 분위기는 어떠셨나요?' },
    { key: 'parking', label: '주차', emoji: '🚗', description: '주차는 편리하셨나요?' },
    { key: 'revisit', label: '재방문', emoji: '❤️', description: '다시 방문하고 싶으신가요?' }
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: 'white',
              borderRadius: '1rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
            
            {/* 헤더 */}
            <div style={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f55336 100%)',
              padding: '1.5rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {existingReview ? '리뷰 수정하기' : '리뷰 작성하기'}
                </h2>
                {userName && (
                  <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                    {userName}님의 소중한 의견을 들려주세요
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                <XMarkIcon style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
              </button>
            </div>

            {/* 콘텐츠 */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1.5rem'
            }}>
              {/* 평균 평점 표시 */}
              <div style={{
                textAlign: 'center',
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                borderRadius: '0.75rem'
              }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#ff6b35' }}>
                  {calculateAverageRating()}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#7f8c8d' }}>평균 평점</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                  {[1,2,3,4,5].map(star => {
                    const avg = parseFloat(calculateAverageRating())
                    return star <= Math.round(avg) ? (
                      <StarIcon key={star} style={{ width: '1.5rem', height: '1.5rem', color: '#ffb347' }} />
                    ) : (
                      <StarOutline key={star} style={{ width: '1.5rem', height: '1.5rem', color: '#e0e0e0' }} />
                    )
                  })}
                </div>
              </div>

              {/* 카테고리별 평점 */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2c3e50' }}>
                  항목별 평가
                </h3>
                {ratingCategories.map(category => (
                  <div key={category.key} style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: '#f9f9f9',
                    borderRadius: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.25rem' }}>{category.emoji}</span>
                        <span style={{ fontWeight: '600', color: '#2c3e50' }}>{category.label}</span>
                      </div>
                      <span style={{ fontSize: '0.875rem', color: '#ff6b35', fontWeight: 'bold' }}>
                        {ratings[category.key as keyof typeof ratings]}/5
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#7f8c8d', marginBottom: '0.5rem' }}>
                      {category.description}
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[1,2,3,4,5].map(star => (
                        <button
                          key={star}
                          onClick={() => handleRatingClick(category.key as keyof typeof ratings, star)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            transition: 'transform 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                          {star <= ratings[category.key as keyof typeof ratings] ? (
                            <StarIcon style={{ width: '2rem', height: '2rem', color: '#ffb347' }} />
                          ) : (
                            <StarOutline style={{ width: '2rem', height: '2rem', color: '#e0e0e0' }} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 제목 입력 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                  제목 (선택)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="리뷰 제목을 입력해주세요"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* 리뷰 내용 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                  리뷰 내용 <span style={{ color: '#ff6b35' }}>*</span>
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="방문 경험을 자세히 들려주세요 (최소 10자)"
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e0e0e0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
                <div style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem', color: '#7f8c8d' }}>
                  {content.length}자
                </div>
              </div>

              {/* 이미지 URL 추가 */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                  <CameraIcon style={{ width: '1.25rem', height: '1.25rem', display: 'inline', marginRight: '0.25rem' }} />
                  사진 추가 (선택)
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="이미지 URL을 입력하세요"
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #e0e0e0',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <button
                    onClick={handleAddImage}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#ff6b35',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}>
                    추가
                  </button>
                </div>
                {imageUrls.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {imageUrls.map((url, index) => (
                      <div key={index} style={{
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        background: '#f0f0f0'
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url}
                          alt={`리뷰 이미지 ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiPkltYWdlPC90ZXh0PjwvZz48L3N2Zz4='
                          }}
                        />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          style={{
                            position: 'absolute',
                            top: '0.25rem',
                            right: '0.25rem',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '1.5rem',
                            height: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 추천 여부 */}
              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #fff8f6 0%, #fff1ee 100%)',
                borderRadius: '0.5rem',
                marginBottom: '1rem'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={isRecommended}
                    onChange={(e) => setIsRecommended(e.target.checked)}
                    style={{
                      marginRight: '0.5rem',
                      width: '1.25rem',
                      height: '1.25rem'
                    }}
                  />
                  <span style={{ fontWeight: '600', color: '#2c3e50' }}>
                    👍 다른 사람에게 추천합니다
                  </span>
                </label>
              </div>
            </div>

            {/* 푸터 */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '0.5rem'
            }}>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}>
                취소
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                style={{
                  flex: 2,
                  padding: '0.75rem',
                  background: isSubmitting ? '#ccc' : 'linear-gradient(90deg, #ff6b35 0%, #f55336 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}>
                {isSubmitting ? '처리 중...' : (existingReview ? '리뷰 수정하기' : '리뷰 작성하기')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ReviewModal