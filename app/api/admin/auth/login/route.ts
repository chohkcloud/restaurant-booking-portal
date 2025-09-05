import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('Admin login request received')
    const { email, password } = await request.json()
    console.log('Login attempt for:', email)

    if (!email || !password) {
      console.log('Missing email or password')
      return NextResponse.json(
        { error: '이메일과 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      )
    }

    // 관리자 계정 조회
    console.log('Querying admin table for email:', email)
    const { data: admin, error: selectError } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single()

    console.log('Admin query result:', { admin, selectError })

    if (selectError || !admin) {
      console.log('Admin not found or error:', selectError)
      return NextResponse.json(
        { error: '존재하지 않는 관리자 계정입니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        type: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    // 비밀번호 제외하고 응답
    const { password: _, ...adminWithoutPassword } = admin

    return NextResponse.json({
      message: '로그인 성공',
      admin: adminWithoutPassword,
      token
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}