import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// 임시 테스트용 - 실제 배포시에는 제거해야 함
export async function POST() {
  try {
    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash('admin123!', 10)
    
    return NextResponse.json({
      message: '테스트 관리자 계정 정보',
      email: 'admin@restaurant.com',
      hashedPassword,
      instructions: [
        '1. Supabase 대시보드에서 SQL Editor 열기',
        '2. 다음 쿼리 실행:',
        `INSERT INTO public.admins (email, password, name, role) VALUES ('admin@restaurant.com', '${hashedPassword}', '관리자', 'admin');`
      ]
    })
  } catch (error) {
    console.error('Test admin creation error:', error)
    return NextResponse.json(
      { error: '테스트 관리자 생성 실패' },
      { status: 500 }
    )
  }
}