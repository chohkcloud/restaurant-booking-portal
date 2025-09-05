export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  description: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Restaurant {
  id: string
  name: string
  slug: string
  description: string | null
  category_id: string | null
  category?: Category
  address: string | null
  phone: string | null
  email: string | null
  opening_hours: any
  price_range: '$' | '$$' | '$$$' | '$$$$' | null
  rating: number
  total_reviews: number
  image_url: string | null
  images: string[]
  amenities: string[]
  is_featured: boolean
  is_active: boolean
  min_party_size: number
  max_party_size: number
  reservation_enabled: boolean
  delivery_enabled: boolean
  takeout_enabled: boolean
  created_at: string
  updated_at: string
}

export interface RestaurantMenu {
  id: string
  restaurant_id: string
  name: string
  description: string | null
  price: number
  category: string | null
  image_url: string | null
  is_popular: boolean
  is_available: boolean
  tags: string[]
  created_at: string
  updated_at: string
}