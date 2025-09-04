import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 생성 함수
function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseServiceKey || supabaseServiceKey === 'your_service_role_key') {
    throw new Error('Missing or invalid SUPABASE_SERVICE_ROLE_KEY environment variable')
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

// GET: 리뷰 목록 조회
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const restaurant_name = searchParams.get('restaurant_name')
    const user_id = searchParams.get('user_id')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const sort = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    let query = supabase
      .from('reviews')
      .select(`
        *,
        users (
          id,
          name,
          email
        )
      `)

    // 필터 적용
    if (restaurant_name) {
      query = query.eq('restaurant_name', restaurant_name)
    }
    if (user_id) {
      query = query.eq('user_id', user_id)
    }

    // 정렬 적용
    query = query.order(sort, { ascending: order === 'asc' })

    // 페이지네이션
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      console.error('리뷰 조회 오류:', error)
      return NextResponse.json(
        { success: false, message: '리뷰 조회에 실패했습니다.', error: error.message },
        { status: 500 }
      )
    }

    // 리뷰 통계 가져오기
    const { data: stats } = await supabase
      .from('review_statistics')
      .select('*')
      .eq('restaurant_name', restaurant_name || '맛집 예약 포털')
      .single()

    return NextResponse.json({
      success: true,
      reviews: data || [],
      statistics: stats,
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: offset + limit < (count || 0)
      }
    })
  } catch (error) {
    console.error('GET /api/reviews 오류:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// POST: 리뷰 작성
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    
    // 필수 필드 검증
    const requiredFields = [
      'user_id',
      'rating_taste',
      'rating_service', 
      'rating_cleanliness',
      'rating_atmosphere',
      'rating_parking',
      'rating_revisit',
      'content'
    ]

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          { success: false, message: `${field}는 필수 입력 항목입니다.` },
          { status: 400 }
        )
      }
    }

    // 평점 유효성 검사 (1-5점)
    const ratingFields = [
      'rating_taste',
      'rating_service',
      'rating_cleanliness',
      'rating_atmosphere',
      'rating_parking',
      'rating_revisit'
    ]

    for (const field of ratingFields) {
      if (body[field] < 1 || body[field] > 5) {
        return NextResponse.json(
          { success: false, message: `${field}는 1-5점 사이여야 합니다.` },
          { status: 400 }
        )
      }
    }

    // 리뷰 데이터 생성
    const reviewData = {
      user_id: body.user_id,
      reservation_id: body.reservation_id || null,
      restaurant_name: body.restaurant_name || '맛집 예약 포털',
      rating_taste: body.rating_taste,
      rating_service: body.rating_service,
      rating_cleanliness: body.rating_cleanliness,
      rating_atmosphere: body.rating_atmosphere,
      rating_parking: body.rating_parking,
      rating_revisit: body.rating_revisit,
      title: body.title || null,
      content: body.content,
      image_urls: body.image_urls || [],
      is_recommended: body.is_recommended !== undefined ? body.is_recommended : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // 리뷰 저장
    const { data, error } = await supabase
      .from('reviews')
      .insert(reviewData)
      .select()
      .single()

    if (error) {
      console.error('리뷰 저장 오류:', error)
      return NextResponse.json(
        { success: false, message: '리뷰 저장에 실패했습니다.', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '리뷰가 성공적으로 작성되었습니다.',
      review: data
    })
  } catch (error) {
    console.error('POST /api/reviews 오류:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// PATCH: 리뷰 수정
export async function PATCH(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()
    const { review_id, user_id, ...updateData } = body

    if (!review_id || !user_id) {
      return NextResponse.json(
        { success: false, message: '리뷰 ID와 사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 리뷰 소유자 확인
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', review_id)
      .single()

    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (existingReview.user_id !== user_id) {
      return NextResponse.json(
        { success: false, message: '본인의 리뷰만 수정할 수 있습니다.' },
        { status: 403 }
      )
    }

    // 평점 유효성 검사
    const ratingFields = [
      'rating_taste',
      'rating_service',
      'rating_cleanliness',
      'rating_atmosphere',
      'rating_parking',
      'rating_revisit'
    ]

    for (const field of ratingFields) {
      if (updateData[field] !== undefined) {
        if (updateData[field] < 1 || updateData[field] > 5) {
          return NextResponse.json(
            { success: false, message: `${field}는 1-5점 사이여야 합니다.` },
            { status: 400 }
          )
        }
      }
    }

    // 업데이트 시간 추가
    updateData.updated_at = new Date().toISOString()

    // 리뷰 업데이트
    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', review_id)
      .select()
      .single()

    if (error) {
      console.error('리뷰 수정 오류:', error)
      return NextResponse.json(
        { success: false, message: '리뷰 수정에 실패했습니다.', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '리뷰가 성공적으로 수정되었습니다.',
      review: data
    })
  } catch (error) {
    console.error('PATCH /api/reviews 오류:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// DELETE: 리뷰 삭제
export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const searchParams = request.nextUrl.searchParams
    const review_id = searchParams.get('review_id')
    const user_id = searchParams.get('user_id')

    if (!review_id || !user_id) {
      return NextResponse.json(
        { success: false, message: '리뷰 ID와 사용자 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 리뷰 소유자 확인
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', review_id)
      .single()

    if (!existingReview) {
      return NextResponse.json(
        { success: false, message: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (existingReview.user_id !== user_id) {
      return NextResponse.json(
        { success: false, message: '본인의 리뷰만 삭제할 수 있습니다.' },
        { status: 403 }
      )
    }

    // 리뷰 삭제
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', review_id)

    if (error) {
      console.error('리뷰 삭제 오류:', error)
      return NextResponse.json(
        { success: false, message: '리뷰 삭제에 실패했습니다.', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '리뷰가 성공적으로 삭제되었습니다.'
    })
  } catch (error) {
    console.error('DELETE /api/reviews 오류:', error)
    return NextResponse.json(
      { success: false, message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}