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
    const eventType = searchParams.get('event_type')
    const isActive = searchParams.get('is_active')

    let query = supabase
      .from('events')
      .select('*')
      .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
      .order('created_at', { ascending: false })

    if (eventType) {
      query = query.eq('event_type', eventType)
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data: events, error } = await query

    if (error) {
      console.error('이벤트 조회 오류:', error)
      return NextResponse.json(
        { error: '이벤트를 불러올 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      events: events || []
    })
  } catch (error) {
    console.error('이벤트 API 오류:', error)
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
      title,
      description,
      event_type,
      discount_rate,
      discount_amount,
      start_date,
      end_date,
      start_time,
      end_time,
      image_url,
      is_active,
      max_participants,
      conditions
    } = await request.json()

    if (!title || !description || !start_date || !end_date) {
      return NextResponse.json(
        { error: '필수 필드를 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    // 날짜 유효성 검사
    if (new Date(start_date) > new Date(end_date)) {
      return NextResponse.json(
        { error: '시작일이 종료일보다 늦을 수 없습니다.' },
        { status: 400 }
      )
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        restaurant_id: DEFAULT_RESTAURANT_ID,
        title,
        description,
        event_type: event_type || 'promotion',
        discount_rate: discount_rate || 0,
        discount_amount: discount_amount || 0,
        start_date,
        end_date,
        start_time: start_time || null,
        end_time: end_time || null,
        image_url: image_url || null,
        is_active: is_active !== false,
        max_participants: max_participants || null,
        current_participants: 0,
        conditions: conditions || null
      })
      .select()
      .single()

    if (error) {
      console.error('이벤트 생성 오류:', error)
      return NextResponse.json(
        { error: '이벤트를 생성할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '이벤트가 생성되었습니다.',
      event
    }, { status: 201 })
  } catch (error) {
    console.error('이벤트 생성 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}