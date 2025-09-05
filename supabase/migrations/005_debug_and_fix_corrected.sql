-- Debug: 현재 테이블 상태 확인
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'restaurants', 'restaurant_menus', 'reservations', 'reviews')
ORDER BY table_name, ordinal_position;

-- 테이블 존재 여부 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'restaurants', 'restaurant_menus');

-- categories 테이블이 있는지 확인하고 없으면 생성
DO $create_tables$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'categories') THEN
        CREATE TABLE public.categories (
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
        
        ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Categories are viewable by everyone" ON public.categories
            FOR SELECT USING (is_active = true);
            
        RAISE NOTICE 'Categories table created successfully';
    ELSE
        RAISE NOTICE 'Categories table already exists';
    END IF;
END $create_tables$;

-- restaurants 테이블이 있는지 확인하고 없으면 생성
DO $create_restaurants$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'restaurants') THEN
        CREATE TABLE public.restaurants (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            description TEXT,
            category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
            address TEXT,
            phone TEXT,
            email TEXT,
            opening_hours JSONB,
            price_range TEXT CHECK (price_range IN ('1', '2', '3', '4')),
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
        
        ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Active restaurants are viewable by everyone" ON public.restaurants
            FOR SELECT USING (is_active = true);
            
        RAISE NOTICE 'Restaurants table created successfully';
    ELSE
        RAISE NOTICE 'Restaurants table already exists';
    END IF;
END $create_restaurants$;

-- restaurant_menus 테이블이 있는지 확인하고 없으면 생성
DO $create_menus$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = 'restaurant_menus') THEN
        CREATE TABLE public.restaurant_menus (
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
        
        ALTER TABLE public.restaurant_menus ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Restaurant menus are viewable by everyone" ON public.restaurant_menus
            FOR SELECT USING (is_available = true);
            
        RAISE NOTICE 'Restaurant menus table created successfully';
    ELSE
        RAISE NOTICE 'Restaurant menus table already exists';
    END IF;
END $create_menus$;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS restaurants_category_idx ON public.restaurants(category_id);
CREATE INDEX IF NOT EXISTS restaurants_slug_idx ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS restaurants_active_idx ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);
CREATE INDEX IF NOT EXISTS restaurant_menus_restaurant_idx ON public.restaurant_menus(restaurant_id);

-- 최종 테이블 상태 확인
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'restaurants', 'restaurant_menus')
ORDER BY table_name, ordinal_position;