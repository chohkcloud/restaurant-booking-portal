import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
      .update({
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
        conditions: conditions || null
      })
      .eq('id', (await params).id)
      .select()
      .single()

    if (error) {
      console.error('이벤트 수정 오류:', error)
      return NextResponse.json(
        { error: '이벤트를 수정할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '이벤트가 수정되었습니다.',
      event
    })
  } catch (error) {
    console.error('이벤트 수정 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: '인증이 필요합니다.' },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', (await params).id)

    if (error) {
      console.error('이벤트 삭제 오류:', error)
      return NextResponse.json(
        { error: '이벤트를 삭제할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '이벤트가 삭제되었습니다.'
    })
  } catch (error) {
    console.error('이벤트 삭제 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}