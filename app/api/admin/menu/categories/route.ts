import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 기본 레스토랑 ID (실제 환경에서는 JWT에서 추출하거나 설정에서 가져옴)
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

    const { data: categories, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('카테고리 조회 오류:', error)
      return NextResponse.json(
        { error: '카테고리를 불러올 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      categories: categories || []
    })
  } catch (error) {
    console.error('카테고리 API 오류:', error)
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

    const { name, display_order } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: '카테고리명을 입력해주세요.' },
        { status: 400 }
      )
    }

    const { data: category, error } = await supabase
      .from('menu_categories')
      .insert({
        restaurant_id: DEFAULT_RESTAURANT_ID,
        name,
        display_order: display_order || 0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('카테고리 생성 오류:', error)
      return NextResponse.json(
        { error: '카테고리를 생성할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '카테고리가 생성되었습니다.',
      category
    }, { status: 201 })
  } catch (error) {
    console.error('카테고리 생성 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}