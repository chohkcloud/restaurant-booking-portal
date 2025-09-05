import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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
      .from('restaurant_images')
      .delete()
      .eq('id', (await params).id)

    if (error) {
      console.error('이미지 삭제 오류:', error)
      return NextResponse.json(
        { error: '이미지를 삭제할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '이미지가 삭제되었습니다.'
    })
  } catch (error) {
    console.error('이미지 삭제 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}