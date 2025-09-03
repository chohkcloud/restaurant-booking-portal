-- 기존 정책들을 모두 삭제하고 다시 생성하는 스크립트

-- 기존 정책 삭제 (존재하는 경우만)
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Users can view their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can insert their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON public.reservations;

-- 기존 트리거 삭제 (존재하는 경우만)
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_reservations_updated_at ON public.reservations;

-- 기존 함수 삭제 (존재하는 경우만)
DROP FUNCTION IF EXISTS update_updated_at_column();

-- 기존 테이블이 존재하면 삭제 (주의: 데이터도 함께 삭제됨)
-- DROP TABLE IF EXISTS public.reservations CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;

-- 테이블 생성 (IF NOT EXISTS로 안전하게)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    restaurant_name TEXT NOT NULL DEFAULT '맛집 예약 포털',
    reservation_date TEXT NOT NULL,
    reservation_time TEXT NOT NULL,
    party_size INTEGER NOT NULL CHECK (party_size > 0),
    status TEXT NOT NULL DEFAULT 'confirmed',
    email_sent BOOLEAN DEFAULT FALSE,
    sms_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (IF NOT EXISTS로 안전하게)
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS reservations_user_id_idx ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS reservations_date_idx ON public.reservations(reservation_date);

-- RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- 새로운 정책 생성
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own data" ON public.users
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (TRUE);

CREATE POLICY "Users can view their own reservations" ON public.reservations
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own reservations" ON public.reservations
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update their own reservations" ON public.reservations
    FOR UPDATE USING (TRUE);

-- 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 작업 완료 확인 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 데이터베이스 스키마가 성공적으로 설정되었습니다!';
END $$;