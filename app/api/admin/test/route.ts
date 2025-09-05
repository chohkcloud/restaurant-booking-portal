import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    console.log('Testing database connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    // 테이블 존재 확인
    const { data: tables, error: tableError } = await supabase
      .from('admins')
      .select('count')
      .limit(1)

    console.log('Table query result:', { tables, tableError })

    // 관리자 계정 확인
    const { data: admins, error: adminError } = await supabase
      .from('admins')
      .select('*')

    console.log('Admin accounts:', { admins, adminError })

    return NextResponse.json({
      message: 'Database connection test',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasJwtSecret: !!process.env.JWT_SECRET,
      tables,
      tableError,
      admins,
      adminError
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { error: 'Database connection failed', details: error },
      { status: 500 }
    )
  }
}