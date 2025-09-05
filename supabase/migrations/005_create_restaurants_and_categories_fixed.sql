-- Create categories table for food types (if not exists)
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

-- Create restaurants table (if not exists)
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

-- Create restaurant_menus table (if not exists)
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

-- Add restaurant_id column to reservations table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'reservations' 
                   AND column_name = 'restaurant_id') THEN
        ALTER TABLE public.reservations 
        ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Add restaurant_id column to reviews table if it exists and doesn't have the column
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'reviews') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' 
                       AND table_name = 'reviews' 
                       AND column_name = 'restaurant_id') THEN
            ALTER TABLE public.reviews 
            ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE;
        END IF;
    END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS restaurants_category_idx ON public.restaurants(category_id);
CREATE INDEX IF NOT EXISTS restaurants_slug_idx ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS restaurants_active_idx ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);
CREATE INDEX IF NOT EXISTS restaurant_menus_restaurant_idx ON public.restaurant_menus(restaurant_id);

-- Enable RLS if not already enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_menus ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Active restaurants are viewable by everyone" ON public.restaurants;
CREATE POLICY "Active restaurants are viewable by everyone" ON public.restaurants
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Restaurant menus are viewable by everyone" ON public.restaurant_menus;
CREATE POLICY "Restaurant menus are viewable by everyone" ON public.restaurant_menus
    FOR SELECT USING (is_available = true);

-- Create triggers for updated_at if function exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        DROP TRIGGER IF EXISTS update_categories_updated_at ON public.categories;
        CREATE TRIGGER update_categories_updated_at 
            BEFORE UPDATE ON public.categories
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_restaurants_updated_at ON public.restaurants;
        CREATE TRIGGER update_restaurants_updated_at 
            BEFORE UPDATE ON public.restaurants
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

        DROP TRIGGER IF EXISTS update_restaurant_menus_updated_at ON public.restaurant_menus;
        CREATE TRIGGER update_restaurant_menus_updated_at 
            BEFORE UPDATE ON public.restaurant_menus
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Clear existing categories and restaurants data first
DELETE FROM public.restaurant_menus;
DELETE FROM public.restaurants;
DELETE FROM public.categories;

-- Insert categories
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
INSERT INTO public.restaurants (name, slug, description, category_id, address, phone, price_range, rating, total_reviews, image_url, is_featured, delivery_enabled, takeout_enabled) 
VALUES 
    ('맛있는 김치찌개', 'kimchi-jjigae', '전통 한식 김치찌개 전문점', 
     (SELECT id FROM categories WHERE slug = 'korean'), 
     '서울시 강남구 테헤란로 123', '02-1234-5678', '$$', 4.5, 324,
     'https://images.unsplash.com/photo-1583224944844-5b268c057b72', true, true, true),
    
    ('스시 오마카세', 'sushi-omakase', '프리미엄 일식 오마카세', 
     (SELECT id FROM categories WHERE slug = 'sushi'), 
     '서울시 강남구 청담동 456', '02-2345-6789', '$$$$', 4.8, 157,
     'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', true, false, false),
    
    ('피자 마을', 'pizza-village', '수제 화덕 피자', 
     (SELECT id FROM categories WHERE slug = 'pizza'), 
     '서울시 마포구 연남동 789', '02-3456-7890', '$$', 4.3, 892,
     'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38', false, true, true),
    
    ('버거 팩토리', 'burger-factory', '수제 버거 전문점', 
     (SELECT id FROM categories WHERE slug = 'burger'), 
     '서울시 용산구 이태원동 321', '02-4567-8901', '$$', 4.6, 445,
     'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', false, true, true),
    
    ('딤섬 하우스', 'dimsum-house', '홍콩식 딤섬 전문점', 
     (SELECT id FROM categories WHERE slug = 'chinese'), 
     '서울시 중구 명동 654', '02-5678-9012', '$$$', 4.4, 238,
     'https://images.unsplash.com/photo-1563245372-f21724e3856d', true, true, true),
    
    ('BBQ 치킨', 'bbq-chicken', '바삭한 후라이드 치킨', 
     (SELECT id FROM categories WHERE slug = 'chicken'), 
     '서울시 송파구 잠실동 111', '02-6789-0123', '$$', 4.5, 1023,
     'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58', false, true, true),
    
    ('파스타 부띠크', 'pasta-boutique', '이탈리안 파스타 전문점', 
     (SELECT id FROM categories WHERE slug = 'western'), 
     '서울시 강남구 삼성동 222', '02-7890-1234', '$$$', 4.7, 356,
     'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9', true, false, true),
    
    ('카페 모카', 'cafe-mocha', '분위기 좋은 브런치 카페', 
     (SELECT id FROM categories WHERE slug = 'cafe'), 
     '서울시 성동구 성수동 333', '02-8901-2345', '$$', 4.2, 567,
     'https://images.unsplash.com/photo-1554118811-1e0d58224f24', false, false, true),
    
    ('떡볶이 천국', 'tteokbokki-heaven', '매콤달콤 떡볶이', 
     (SELECT id FROM categories WHERE slug = 'snack'), 
     '서울시 종로구 광장시장 444', '02-9012-3456', '$', 4.6, 789,
     'https://images.unsplash.com/photo-1635363638580-c2809d049eee', false, true, true),
    
    ('쌀국수 사이공', 'pho-saigon', '베트남 정통 쌀국수', 
     (SELECT id FROM categories WHERE slug = 'asian'), 
     '서울시 용산구 이태원동 555', '02-0123-4567', '$$', 4.3, 412,
     'https://images.unsplash.com/photo-1569718212165-3a8278d5f624', false, true, true);

-- Insert sample menus for some restaurants
INSERT INTO public.restaurant_menus (restaurant_id, name, description, price, category, is_popular, is_available) 
VALUES 
    ((SELECT id FROM restaurants WHERE slug = 'kimchi-jjigae'), '김치찌개', '숙성 김치로 끓인 진한 김치찌개', 9000, '메인', true, true),
    ((SELECT id FROM restaurants WHERE slug = 'kimchi-jjigae'), '된장찌개', '구수한 된장찌개', 9000, '메인', false, true),
    ((SELECT id FROM restaurants WHERE slug = 'kimchi-jjigae'), '제육볶음', '매콤한 제육볶음', 12000, '메인', true, true),
    
    ((SELECT id FROM restaurants WHERE slug = 'pizza-village'), '마르게리타', '토마토와 모짜렐라 피자', 18000, '피자', true, true),
    ((SELECT id FROM restaurants WHERE slug = 'pizza-village'), '페퍼로니', '페퍼로니 피자', 20000, '피자', true, true),
    ((SELECT id FROM restaurants WHERE slug = 'pizza-village'), '하와이안', '파인애플 피자', 19000, '피자', false, true),
    
    ((SELECT id FROM restaurants WHERE slug = 'burger-factory'), '클래식 버거', '소고기 패티 버거', 12000, '버거', true, true),
    ((SELECT id FROM restaurants WHERE slug = 'burger-factory'), '치즈 버거', '더블 치즈 버거', 14000, '버거', true, true),
    ((SELECT id FROM restaurants WHERE slug = 'burger-factory'), '베이컨 버거', '베이컨 버거', 15000, '버거', false, true);