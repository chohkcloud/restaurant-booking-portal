import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface ReviewData {
  user_id: string
  reservation_id?: string
  restaurant_name?: string
  rating_taste: number
  rating_service: number
  rating_cleanliness: number
  rating_atmosphere: number
  rating_parking: number
  rating_revisit: number
  title?: string
  content: string
  image_urls?: string[]
  is_recommended?: boolean
}

export interface Review extends ReviewData {
  id: string
  rating_average: number
  created_at: string
  updated_at: string
  users?: {
    id: string
    name: string
    email: string
  }
}

// 리뷰 작성
export async function createReview(reviewData: ReviewData) {
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || '리뷰 작성에 실패했습니다.')
    }

    return {
      success: true,
      review: data.review,
      message: data.message
    }
  } catch (error) {
    console.error('리뷰 작성 오류:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '리뷰 작성 중 오류가 발생했습니다.'
    }
  }
}

// 리뷰 목록 조회
export async function getReviews(params?: {
  restaurant_name?: string
  user_id?: string
  limit?: number
  offset?: number
  sort?: 'created_at' | 'rating_average'
  order?: 'asc' | 'desc'
}) {
  try {
    const queryParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value))
        }
      })
    }

    const response = await fetch(`/api/reviews?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || '리뷰 조회에 실패했습니다.')
    }

    return {
      success: true,
      reviews: data.reviews || [],
      statistics: data.statistics,
      pagination: data.pagination
    }
  } catch (error) {
    console.error('리뷰 조회 오류:', error)
    return {
      success: false,
      reviews: [],
      message: error instanceof Error ? error.message : '리뷰 조회 중 오류가 발생했습니다.'
    }
  }
}

// 리뷰 수정
export async function updateReview(
  reviewId: string,
  userId: string,
  updateData: Partial<ReviewData>
) {
  try {
    const response = await fetch('/api/reviews', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        review_id: reviewId,
        user_id: userId,
        ...updateData
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || '리뷰 수정에 실패했습니다.')
    }

    return {
      success: true,
      review: data.review,
      message: data.message
    }
  } catch (error) {
    console.error('리뷰 수정 오류:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '리뷰 수정 중 오류가 발생했습니다.'
    }
  }
}

// 리뷰 삭제
export async function deleteReview(reviewId: string, userId: string) {
  try {
    const response = await fetch(`/api/reviews?review_id=${reviewId}&user_id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || '리뷰 삭제에 실패했습니다.')
    }

    return {
      success: true,
      message: data.message
    }
  } catch (error) {
    console.error('리뷰 삭제 오류:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : '리뷰 삭제 중 오류가 발생했습니다.'
    }
  }
}

// 내 리뷰 목록 조회
export async function getMyReviews(userId: string) {
  return getReviews({
    user_id: userId,
    sort: 'created_at',
    order: 'desc'
  })
}

// 예약에 대한 리뷰 확인
export async function checkReservationReview(reservationId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('reservation_id', reservationId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116: 결과가 없을 때의 에러 코드
      throw error
    }

    return {
      success: true,
      hasReview: !!data,
      review: data
    }
  } catch (error) {
    console.error('예약 리뷰 확인 오류:', error)
    return {
      success: false,
      hasReview: false,
      message: '리뷰 확인 중 오류가 발생했습니다.'
    }
  }
}

// 리뷰 통계 조회
export async function getReviewStatistics(restaurantName: string = '맛집 예약 포털') {
  try {
    const { data, error } = await supabase
      .from('review_statistics')
      .select('*')
      .eq('restaurant_name', restaurantName)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return {
      success: true,
      statistics: data || {
        total_reviews: 0,
        avg_rating: 0,
        avg_taste: 0,
        avg_service: 0,
        avg_cleanliness: 0,
        avg_atmosphere: 0,
        avg_parking: 0,
        avg_revisit: 0,
        recommended_count: 0
      }
    }
  } catch (error) {
    console.error('리뷰 통계 조회 오류:', error)
    return {
      success: false,
      statistics: null,
      message: '리뷰 통계 조회 중 오류가 발생했습니다.'
    }
  }
}