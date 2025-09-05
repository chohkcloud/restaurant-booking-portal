-- Create categories table for food types
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    icon TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    opening_hours JSONB,
    price_range TEXT CHECK (price_range IN ('$', '$$', '$$$', '$$$$')),
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_reviews INTEGER DEFAULT 0,
    image_url TEXT,
    images JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    min_party_size INTEGER DEFAULT 1,
    max_party_size INTEGER DEFAULT 20,
    reservation_enabled BOOLEAN DEFAULT TRUE,
    delivery_enabled BOOLEAN DEFAULT FALSE,
    takeout_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurant_menus table
CREATE TABLE IF NOT EXISTS public.restaurant_menus (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    tags JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update reservations table to link with restaurants
ALTER TABLE public.reservations 
ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL;

-- Update reviews table to link with restaurants
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS restaurants_category_idx ON public.restaurants(category_id);
CREATE INDEX IF NOT EXISTS restaurants_slug_idx ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS restaurants_active_idx ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);
CREATE INDEX IF NOT EXISTS restaurant_menus_restaurant_idx ON public.restaurant_menus(restaurant_id);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_menus ENABLE ROW LEVEL SECURITY;

-- Create policies for categories (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (is_active = true);

-- Create policies for restaurants (public read)
CREATE POLICY "Active restaurants are viewable by everyone" ON public.restaurants
    FOR SELECT USING (is_active = true);

-- Create policies for restaurant_menus (public read)
CREATE POLICY "Restaurant menus are viewable by everyone" ON public.restaurant_menus
    FOR SELECT USING (is_available = true);

-- Create triggers for updated_at
CREATE TRIGGER update_categories_updated_at 
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at 
    BEFORE UPDATE ON public.restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_menus_updated_at 
    BEFORE UPDATE ON public.restaurant_menus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, slug, icon, description, sort_order) VALUES
    ('한식', 'korean', '🍜', '전통 한국 요리', 1),
    ('중식', 'chinese', '🥟', '중국 요리', 2),
    ('일식', 'japanese', '🍱', '일본 요리', 3),
    ('양식', 'western', '🍝', '서양 요리', 4),
    ('치킨', 'chicken', '🍗', '치킨 전문점', 5),
    ('피자', 'pizza', '🍕', '피자 전문점', 6),
    ('버거', 'burger', '🍔', '햄버거 전문점', 7),
    ('카페/디저트', 'cafe', '☕', '카페와 디저트', 8),
    ('분식', 'snack', '🍜', '한국 분식', 9),
    ('아시안', 'asian', '🍛', '아시아 요리', 10),
    ('족발/보쌈', 'pork', '🍖', '족발과 보쌈', 11),
    ('찜/탕', 'stew', '🍲', '찜과 탕 요리', 12),
    ('고기', 'meat', '🥩', '고기 구이', 13),
    ('회/초밥', 'sushi', '🍣', '회와 초밥', 14),
    ('샐러드', 'salad', '🥗', '샐러드 전문점', 15),
    ('샌드위치', 'sandwich', '🥪', '샌드위치 전문점', 16),
    ('도시락', 'lunchbox', '🍱', '도시락 전문점', 17),
    ('죽', 'porridge', '🍚', '죽 전문점', 18),
    ('브런치', 'brunch', '🥐', '브런치 카페', 19),
    ('세계음식', 'world', '🌍', '세계 각국 요리', 20);

-- Insert sample restaurants
INSERT INTO public.restaurants (name, slug, description, category_id, address, phone, price_range, rating, image_url, is_featured) 
VALUES 
    ('맛있는 김치찌개', 'kimchi-jjigae', '전통 한식 김치찌개 전문점', 
     (SELECT id FROM categories WHERE slug = 'korean'), 
     '서울시 강남구 테헤란로 123', '02-1234-5678', '$$', 4.5, 
     'https://images.unsplash.com/photo-1583224944844-5b268c057b72', true),
    
    ('스시 오마카세', 'sushi-omakase', '프리미엄 일식 오마카세', 
     (SELECT id FROM categories WHERE slug = 'sushi'), 
     '서울시 강남구 청담동 456', '02-2345-6789', '$$$$', 4.8, 
     'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', true),
    
    ('피자 마을', 'pizza-village', '수제 화덕 피자', 
     (SELECT id FROM categories WHERE slug = 'pizza'), 
     '서울시 마포구 연남동 789', '02-3456-7890', '$$', 4.3, 
     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', false),
    
    ('버거 팩토리', 'burger-factory', '수제 버거 전문점', 
     (SELECT id FROM categories WHERE slug = 'burger'), 
     '서울시 용산구 이태원동 321', '02-4567-8901', '$$', 4.6, 
     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', false),
    
    ('딤섬 하우스', 'dimsum-house', '홍콩식 딤섬 전문점', 
     (SELECT id FROM categories WHERE slug = 'chinese'), 
     '서울시 중구 명동 654', '02-5678-9012', '$$$', 4.4, 
     'https://images.unsplash.com/photo-1563245372-f21724e3856d', true);