import { supabase } from './supabase'
import type { Category, Restaurant, RestaurantMenu } from '@/types/restaurant'

// 카테고리 관련 함수들
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) throw error
    return { success: true, categories: data as Category[] }
  } catch (error: any) {
    console.error('카테고리 로드 실패:', error)
    return { success: false, message: error.message, categories: [] }
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return { success: true, category: data as Category }
  } catch (error: any) {
    console.error('카테고리 로드 실패:', error)
    return { success: false, message: error.message, category: null }
  }
}

// 레스토랑 관련 함수들
export async function getRestaurants(options?: {
  categoryId?: string
  categorySlug?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
}) {
  try {
    let query = supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_active', true)

    if (options?.categoryId) {
      query = query.eq('category_id', options.categoryId)
    }

    if (options?.categorySlug) {
      // 먼저 카테고리 ID를 가져옴
      const { category } = await getCategoryBySlug(options.categorySlug)
      if (category) {
        query = query.eq('category_id', category.id)
      }
    }

    if (options?.search) {
      query = query.or(`name.ilike.%${options.search}%,description.ilike.%${options.search}%`)
    }

    if (options?.featured) {
      query = query.eq('is_featured', true)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    query = query.order('rating', { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return { success: true, restaurants: data as Restaurant[] }
  } catch (error: any) {
    console.error('레스토랑 목록 로드 실패:', error)
    return { success: false, message: error.message, restaurants: [] }
  }
}

export async function getRestaurantBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return { success: true, restaurant: data as Restaurant }
  } catch (error: any) {
    console.error('레스토랑 로드 실패:', error)
    return { success: false, message: error.message, restaurant: null }
  }
}

export async function getRestaurantById(id: string) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return { success: true, restaurant: data as Restaurant }
  } catch (error: any) {
    console.error('레스토랑 로드 실패:', error)
    return { success: false, message: error.message, restaurant: null }
  }
}

// 메뉴 관련 함수들
export async function getRestaurantMenus(restaurantId: string) {
  try {
    const { data, error } = await supabase
      .from('restaurant_menus')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)
      .order('is_popular', { ascending: false })

    if (error) throw error
    return { success: true, menus: data as RestaurantMenu[] }
  } catch (error: any) {
    console.error('메뉴 로드 실패:', error)
    return { success: false, message: error.message, menus: [] }
  }
}

// 추천 레스토랑 가져오기
export async function getFeaturedRestaurants() {
  return getRestaurants({ featured: true, limit: 6 })
}

// 인기 레스토랑 가져오기 (평점 기준)
export async function getPopularRestaurants(limit: number = 10) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .order('total_reviews', { ascending: false })
      .limit(limit)

    if (error) throw error
    return { success: true, restaurants: data as Restaurant[] }
  } catch (error: any) {
    console.error('인기 레스토랑 로드 실패:', error)
    return { success: false, message: error.message, restaurants: [] }
  }
}