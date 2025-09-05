import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const DEFAULT_RESTAURANT_ID = '550e8400-e29b-41d4-a716-446655440000'

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

    // 먼저 모든 기존 대표 이미지들을 해제
    await supabase
      .from('restaurant_images')
      .update({ is_primary: false })
      .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
      .eq('is_primary', true)

    // 선택된 이미지를 대표 이미지로 설정
    const { data: image, error } = await supabase
      .from('restaurant_images')
      .update({ is_primary: true })
      .eq('id', (await params).id)
      .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
      .select()
      .single()

    if (error) {
      console.error('대표 이미지 설정 오류:', error)
      return NextResponse.json(
        { error: '대표 이미지를 설정할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '대표 이미지가 설정되었습니다.',
      image
    })
  } catch (error) {
    console.error('대표 이미지 설정 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}