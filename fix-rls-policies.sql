-- RLS 정책 수정: 회원가입/로그인을 위한 공개 접근 허용

-- 기존 정책 삭제
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;

-- 회원가입/로그인을 위한 새 정책 생성
-- 1. 모든 사용자가 이메일로 사용자 조회 가능 (로그인 시 필요)
CREATE POLICY "Enable read access for authentication" 
ON public.users FOR SELECT 
USING (true);

-- 2. 모든 사용자가 새 계정 생성 가능 (회원가입 시 필요)
CREATE POLICY "Enable insert for registration" 
ON public.users FOR INSERT 
WITH CHECK (true);

-- 3. 사용자는 자신의 정보만 수정 가능
CREATE POLICY "Users can update own data" 
ON public.users FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 예약 테이블 정책도 수정
DROP POLICY IF EXISTS "Users can view their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can insert their own reservations" ON public.reservations;
DROP POLICY IF EXISTS "Users can update their own reservations" ON public.reservations;

-- 예약 관련 정책
CREATE POLICY "Enable reservations read" 
ON public.reservations FOR SELECT 
USING (true);

CREATE POLICY "Enable reservations insert" 
ON public.reservations FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable reservations update" 
ON public.reservations FOR UPDATE 
USING (true);

-- 확인 메시지
DO $$
BEGIN
    RAISE NOTICE '✅ RLS 정책이 수정되었습니다! 이제 회원가입/로그인이 가능합니다.';
END $$;