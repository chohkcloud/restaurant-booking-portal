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

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')

    let query = supabase
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', DEFAULT_RESTAURANT_ID)
      .order('display_order', { ascending: true })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data: items, error } = await query

    if (error) {
      console.error('메뉴 아이템 조회 오류:', error)
      return NextResponse.json(
        { error: '메뉴를 불러올 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      items: items || []
    })
  } catch (error) {
    console.error('메뉴 API 오류:', error)
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
      name,
      description,
      price,
      category_id,
      image_url,
      is_available,
      is_recommended,
      ingredients,
      allergens,
      spice_level,
      cooking_time,
      calories
    } = await request.json()

    if (!name || !price) {
      return NextResponse.json(
        { error: '메뉴명과 가격을 입력해주세요.' },
        { status: 400 }
      )
    }

    const { data: item, error } = await supabase
      .from('menu_items')
      .insert({
        restaurant_id: DEFAULT_RESTAURANT_ID,
        category_id: category_id || null,
        name,
        description: description || null,
        price: parseInt(price),
        image_url: image_url || null,
        is_available: is_available !== false,
        is_recommended: is_recommended === true,
        ingredients: ingredients || [],
        allergens: allergens || [],
        spice_level: spice_level || 0,
        cooking_time: cooking_time || null,
        calories: calories || null,
        display_order: 0
      })
      .select()
      .single()

    if (error) {
      console.error('메뉴 아이템 생성 오류:', error)
      return NextResponse.json(
        { error: '메뉴를 생성할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '메뉴가 생성되었습니다.',
      item
    }, { status: 201 })
  } catch (error) {
    console.error('메뉴 생성 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}