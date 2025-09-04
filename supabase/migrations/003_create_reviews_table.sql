-- 리뷰 테이블 생성
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
    restaurant_name TEXT NOT NULL DEFAULT '맛집 예약 포털',
    
    -- 평점 항목들 (1-5점)
    rating_taste INTEGER NOT NULL CHECK (rating_taste >= 1 AND rating_taste <= 5),
    rating_service INTEGER NOT NULL CHECK (rating_service >= 1 AND rating_service <= 5),
    rating_cleanliness INTEGER NOT NULL CHECK (rating_cleanliness >= 1 AND rating_cleanliness <= 5),
    rating_atmosphere INTEGER NOT NULL CHECK (rating_atmosphere >= 1 AND rating_atmosphere <= 5),
    rating_parking INTEGER NOT NULL CHECK (rating_parking >= 1 AND rating_parking <= 5),
    rating_revisit INTEGER NOT NULL CHECK (rating_revisit >= 1 AND rating_revisit <= 5),
    
    -- 평균 평점 (자동 계산)
    rating_average DECIMAL(3,2) GENERATED ALWAYS AS (
        (rating_taste + rating_service + rating_cleanliness + rating_atmosphere + rating_parking + rating_revisit) / 6.0
    ) STORED,
    
    -- 리뷰 내용
    title TEXT,
    content TEXT NOT NULL,
    
    -- 이미지 URL (선택사항)
    image_urls TEXT[], 
    
    -- 추천 여부
    is_recommended BOOLEAN DEFAULT true,
    
    -- 타임스탬프
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_reservation_id_idx ON public.reviews(reservation_id);
CREATE INDEX IF NOT EXISTS reviews_restaurant_name_idx ON public.reviews(restaurant_name);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS reviews_rating_average_idx ON public.reviews(rating_average DESC);

-- RLS 활성화
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS 정책 생성
-- 모든 사용자가 리뷰를 볼 수 있음
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (TRUE);

-- 로그인한 사용자만 리뷰 작성 가능
CREATE POLICY "Authenticated users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 자신의 리뷰만 수정 가능
CREATE POLICY "Users can update their own reviews" ON public.reviews
    FOR UPDATE USING (auth.uid()::UUID = user_id);

-- 자신의 리뷰만 삭제 가능
CREATE POLICY "Users can delete their own reviews" ON public.reviews
    FOR DELETE USING (auth.uid()::UUID = user_id);

-- 트리거 생성 (updated_at 자동 업데이트)
CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 리뷰 통계를 위한 뷰 생성
CREATE OR REPLACE VIEW public.review_statistics AS
SELECT 
    restaurant_name,
    COUNT(*) as total_reviews,
    AVG(rating_average)::DECIMAL(3,2) as avg_rating,
    AVG(rating_taste)::DECIMAL(3,2) as avg_taste,
    AVG(rating_service)::DECIMAL(3,2) as avg_service,
    AVG(rating_cleanliness)::DECIMAL(3,2) as avg_cleanliness,
    AVG(rating_atmosphere)::DECIMAL(3,2) as avg_atmosphere,
    AVG(rating_parking)::DECIMAL(3,2) as avg_parking,
    AVG(rating_revisit)::DECIMAL(3,2) as avg_revisit,
    SUM(CASE WHEN is_recommended THEN 1 ELSE 0 END)::INTEGER as recommended_count
FROM public.reviews
GROUP BY restaurant_name;

-- 뷰에 대한 권한 설정
GRANT SELECT ON public.review_statistics TO authenticated;
GRANT SELECT ON public.review_statistics TO anon;

-- 작업 완료 확인 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ 리뷰 테이블 및 관련 스키마가 성공적으로 생성되었습니다!';
END $$;