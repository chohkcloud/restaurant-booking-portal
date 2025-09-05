-- Step 2: Add columns to existing tables (기존 테이블에 컬럼 추가)

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

-- Create indexes
CREATE INDEX IF NOT EXISTS restaurants_category_idx ON public.restaurants(category_id);
CREATE INDEX IF NOT EXISTS restaurants_slug_idx ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS restaurants_active_idx ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS categories_slug_idx ON public.categories(slug);
CREATE INDEX IF NOT EXISTS restaurant_menus_restaurant_idx ON public.restaurant_menus(restaurant_id);