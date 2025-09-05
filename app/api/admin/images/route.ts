import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 기본 레스토랑 ID
const DEFAULT_RESTAURANT_ID = '550e8400-e29b-41d4-a716-446655440000'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('restaurant_images')
      .select('*')
      .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
      .order('is_primary', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data: images, error } = await query

    if (error) {
      console.error('이미지 조회 오류:', error)
      return NextResponse.json(
        { error: '이미지를 불러올 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      images: images || []
    })
  } catch (error) {
    console.error('이미지 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const {
      image_url,
      alt_text,
      category,
      is_primary
    } = await request.json()

    if (!image_url) {
      return NextResponse.json(
        { error: '이미지 URL을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 대표 이미지로 설정하는 경우 기존 대표 이미지들을 해제
    if (is_primary) {
      await supabase
        .from('restaurant_images')
        .update({ is_primary: false })
        .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
        .eq('is_primary', true)
    }

    const { data: image, error } = await supabase
      .from('restaurant_images')
      .insert({
        restaurant_id: DEFAULT_RESTAURANT_ID,
        image_url,
        alt_text: alt_text || null,
        category: category || 'general',
        is_primary: is_primary === true,
        display_order: 0
      })
      .select()
      .single()

    if (error) {
      console.error('이미지 생성 오류:', error)
      return NextResponse.json(
        { error: '이미지를 추가할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '이미지가 추가되었습니다.',
      image
    }, { status: 201 })
  } catch (error) {
    console.error('이미지 생성 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}