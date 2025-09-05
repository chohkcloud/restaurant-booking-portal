-- 관리자 및 식당 관리 테이블 생성

-- 관리자 테이블 생성
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 식당 정보 테이블
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    opening_hours JSONB, -- {"mon": "9:00-22:00", "tue": "9:00-22:00", ...}
    capacity INTEGER DEFAULT 50,
    price_range TEXT, -- "10000-20000" 형태
    categories TEXT[], -- ["한식", "중식", "양식"] 등
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 메뉴 카테고리 테이블
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 메뉴 테이블
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    image_url TEXT,
    is_available BOOLEAN DEFAULT true,
    is_recommended BOOLEAN DEFAULT false,
    ingredients TEXT[], -- 재료 목록
    allergens TEXT[], -- 알레르기 유발 요소
    spice_level INTEGER DEFAULT 0 CHECK (spice_level >= 0 AND spice_level <= 5),
    cooking_time INTEGER, -- 조리 시간 (분)
    calories INTEGER,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 매장 사진 테이블
CREATE TABLE IF NOT EXISTS public.restaurant_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    category TEXT DEFAULT 'general' CHECK (category IN ('general', 'food', 'interior', 'exterior', 'menu')),
    is_primary BOOLEAN DEFAULT false, -- 대표 이미지 여부
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    event_type TEXT DEFAULT 'promotion' CHECK (event_type IN ('promotion', 'discount', 'new_menu', 'special_event')),
    discount_rate INTEGER DEFAULT 0 CHECK (discount_rate >= 0 AND discount_rate <= 100), -- 할인율 (%)
    discount_amount INTEGER DEFAULT 0 CHECK (discount_amount >= 0), -- 할인 금액
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    max_participants INTEGER, -- 최대 참가자 수 (선착순 이벤트 등)
    current_participants INTEGER DEFAULT 0,
    conditions TEXT, -- 이벤트 조건 (예: "2인 이상 주문시")
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS admins_email_idx ON public.admins(email);
CREATE INDEX IF NOT EXISTS restaurants_name_idx ON public.restaurants(name);
CREATE INDEX IF NOT EXISTS restaurants_is_active_idx ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS menu_categories_restaurant_id_idx ON public.menu_categories(restaurant_id);
CREATE INDEX IF NOT EXISTS menu_items_restaurant_id_idx ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS menu_items_category_id_idx ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS menu_items_is_available_idx ON public.menu_items(is_available);
CREATE INDEX IF NOT EXISTS restaurant_images_restaurant_id_idx ON public.restaurant_images(restaurant_id);
CREATE INDEX IF NOT EXISTS events_restaurant_id_idx ON public.events(restaurant_id);
CREATE INDEX IF NOT EXISTS events_date_range_idx ON public.events(start_date, end_date);
CREATE INDEX IF NOT EXISTS events_is_active_idx ON public.events(is_active);

-- RLS 활성화
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성

-- 관리자 테이블 정책
CREATE POLICY "Admins can view all admin data" ON public.admins
    FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only super admins can insert admins" ON public.admins
    FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Admins can update their own data" ON public.admins
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- 식당 테이블 정책 (모든 사용자가 조회 가능, 관리자만 수정 가능)
CREATE POLICY "Anyone can view restaurants" ON public.restaurants
    FOR SELECT USING (is_active = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage restaurants" ON public.restaurants
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 메뉴 카테고리 정책
CREATE POLICY "Anyone can view menu categories" ON public.menu_categories
    FOR SELECT USING (is_active = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage menu categories" ON public.menu_categories
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 메뉴 아이템 정책
CREATE POLICY "Anyone can view available menu items" ON public.menu_items
    FOR SELECT USING (is_available = true OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage menu items" ON public.menu_items
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 매장 사진 정책
CREATE POLICY "Anyone can view restaurant images" ON public.restaurant_images
    FOR SELECT USING (TRUE);

CREATE POLICY "Admins can manage restaurant images" ON public.restaurant_images
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 이벤트 정책
CREATE POLICY "Anyone can view active events" ON public.events
    FOR SELECT USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can manage events" ON public.events
    FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_admins_updated_at 
    BEFORE UPDATE ON public.admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at 
    BEFORE UPDATE ON public.restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_categories_updated_at 
    BEFORE UPDATE ON public.menu_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at 
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_images_updated_at 
    BEFORE UPDATE ON public.restaurant_images
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 기본 데이터 삽입
INSERT INTO public.restaurants (id, name, description, address, phone, email, opening_hours, capacity, price_range, categories) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', '맛집 예약 포털', '다양한 요리를 선보이는 프리미엄 레스토랑입니다.', '서울시 강남구 테헤란로 123', '02-1234-5678', 'info@restaurant.com', 
    '{"mon": "11:00-22:00", "tue": "11:00-22:00", "wed": "11:00-22:00", "thu": "11:00-22:00", "fri": "11:00-22:00", "sat": "11:00-22:00", "sun": "11:00-21:00"}', 
    100, '15000-30000', '{"한식", "양식", "중식"}')
ON CONFLICT (id) DO NOTHING;

-- 관리자 계정 추가 (기본 비밀번호: admin123!)
INSERT INTO public.admins (email, password, name, role) VALUES 
    ('admin@restaurant.com', '$2b$10$8eJ1K4p0bE8rA.yVd/YNv.Uqf5Vz4.G1Y6qGqL1O4p2E.J4kB8mW6', '관리자', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 작업 완료 확인 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 관리자 및 식당 관리 테이블이 성공적으로 생성되었습니다!';
    RAISE NOTICE '📧 관리자 계정: admin@restaurant.com / 비밀번호: admin123!';
END $$;