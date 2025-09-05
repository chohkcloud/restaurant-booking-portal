-- Step 2 Fixed: Add columns to existing tables (수정된 버전)

-- restaurants 테이블이 존재하는지 먼저 확인
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'restaurants') THEN
        RAISE NOTICE 'Restaurants table exists, proceeding with column additions';
    ELSE
        RAISE EXCEPTION 'Restaurants table does not exist. Please run step 1 first.';
    END IF;
END $$;

-- Add restaurant_id column to reservations table if it doesn't exist
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'reservations') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_schema = 'public' 
                       AND table_name = 'reservations' 
                       AND column_name = 'restaurant_id') THEN
            ALTER TABLE public.reservations 
            ADD COLUMN restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL;
            RAISE NOTICE 'Added restaurant_id column to reservations table';
        ELSE
            RAISE NOTICE 'restaurant_id column already exists in reservations table';
        END IF;
    ELSE
        RAISE NOTICE 'Reservations table does not exist';
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
            RAISE NOTICE 'Added restaurant_id column to reviews table';
        ELSE
            RAISE NOTICE 'restaurant_id column already exists in reviews table';
        END IF;
    ELSE
        RAISE NOTICE 'Reviews table does not exist';
    END IF;
END $$;

-- 테이블이 존재할 때만 인덱스 생성
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'restaurants') THEN
        CREATE INDEX IF NOT EXISTS restaurants_category_idx ON public.restaurants(category_id);
        CREATE INDEX IF NOT EXISTS restaurants_slug_idx ON public.restaurants(slug);
        CREATE INDEX IF NOT EXISTS restaurants_active_idx ON public.restaurants(is_active);
        RAISE NOTICE 'Created indexes for restaurants table';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'categories') THEN
        CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);
        RAISE NOTICE 'Created indexes for categories table';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables 
               WHERE table_schema = 'public' 
               AND table_name = 'restaurant_menus') THEN
        CREATE INDEX IF NOT EXISTS restaurant_menus_restaurant_idx ON public.restaurant_menus(restaurant_id);
        RAISE NOTICE 'Created indexes for restaurant_menus table';
    END IF;
END $$;

-- 최종 상태 확인
SELECT 
    'Tables created:' as status,
    COUNT(*) as count
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'restaurants', 'restaurant_menus');

SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('categories', 'restaurants', 'restaurant_menus', 'reservations', 'reviews')
AND column_name IN ('restaurant_id', 'category_id')
ORDER BY table_name, column_name;