import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyAdminToken } from '@/lib/adminAuth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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
      .update({
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
        calories: calories || null
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('메뉴 아이템 수정 오류:', error)
      return NextResponse.json(
        { error: '메뉴를 수정할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '메뉴가 수정되었습니다.',
      item
    })
  } catch (error) {
    console.error('메뉴 수정 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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
      .from('menu_items')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('메뉴 아이템 삭제 오류:', error)
      return NextResponse.json(
        { error: '메뉴를 삭제할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: '메뉴가 삭제되었습니다.'
    })
  } catch (error) {
    console.error('메뉴 삭제 API 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}