# Supabase 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인/회원가입
2. "New project" 클릭
3. Organization 선택
4. 프로젝트 정보 입력:
   - Name: `restaurant-booking`
   - Database Password: 강력한 비밀번호 설정
   - Region: 가장 가까운 지역 선택 (예: Northeast Asia (Seoul))
5. "Create new project" 클릭

## 2. 환경변수 설정

프로젝트 생성 후 Settings > API에서 다음 정보를 확인:

### .env.local 파일에 추가:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 3. 데이터베이스 스키마 생성

Supabase Dashboard > SQL Editor에서 다음 SQL 실행:

```sql
-- Enable Row Level Security (RLS) - JWT secret은 Supabase에서 자동 관리됨

-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations table
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
CREATE INDEX IF NOT EXISTS reservations_user_id_idx ON public.reservations(user_id);
CREATE INDEX IF NOT EXISTS reservations_date_idx ON public.reservations(reservation_date);

-- Enable RLS on tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own data" ON public.users
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (TRUE);

-- Create policies for reservations table
CREATE POLICY "Users can view their own reservations" ON public.reservations
    FOR SELECT USING (TRUE);

CREATE POLICY "Users can insert their own reservations" ON public.reservations
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can update their own reservations" ON public.reservations
    FOR UPDATE USING (TRUE);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at 
    BEFORE UPDATE ON public.reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 4. 테이블 구조 확인

### users 테이블:
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | Primary Key (자동 생성) |
| name | TEXT | 사용자 이름 |
| email | TEXT | 이메일 (UNIQUE) |
| phone | TEXT | 전화번호 |
| password | TEXT | 암호화된 비밀번호 |
| created_at | TIMESTAMPTZ | 생성일시 |
| updated_at | TIMESTAMPTZ | 수정일시 |

### reservations 테이블:
| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | UUID | Primary Key (자동 생성) |
| user_id | UUID | 사용자 FK |
| restaurant_name | TEXT | 레스토랑 이름 |
| reservation_date | TEXT | 예약 날짜 |
| reservation_time | TEXT | 예약 시간 |
| party_size | INTEGER | 인원수 |
| status | TEXT | 예약 상태 (confirmed, cancelled) |
| email_sent | BOOLEAN | 이메일 발송 여부 |
| sms_sent | BOOLEAN | SMS 발송 여부 |
| created_at | TIMESTAMPTZ | 생성일시 |
| updated_at | TIMESTAMPTZ | 수정일시 |

## 5. 연결 테스트

다음 명령어로 로컬에서 테스트:

```bash
npm run dev
```

브라우저에서 회원가입 → 로그인 → 예약 과정을 테스트하여 DB에 데이터가 정상적으로 저장되는지 확인.

## 6. Vercel 배포 시 환경변수 설정

Vercel Dashboard에서 프로젝트 > Settings > Environment Variables에 다음 추가:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY` (이메일 발송용)
- 기타 SMS 관련 환경변수들

## 7. 보안 고려사항

1. **Row Level Security (RLS)**: 이미 설정됨
2. **API Key 보안**: 환경변수로만 관리, .env.local은 .gitignore에 포함
3. **비밀번호 해싱**: bcrypt 사용 (saltRounds: 12)
4. **HTTPS**: 프로덕션 환경에서는 HTTPS만 사용

## 8. 모니터링 및 로그

Supabase Dashboard에서:
- Database > Tables: 데이터 확인
- Auth > Logs: 인증 로그 확인  
- Database > Logs: SQL 쿼리 로그 확인
- Settings > API > Logs: API 사용량 확인

## 트러블슈팅

### 연결 실패 시:
1. 환경변수가 올바른지 확인
2. Supabase 프로젝트가 활성 상태인지 확인
3. 네트워크 연결 상태 확인

### 인증 실패 시:
1. RLS 정책이 올바른지 확인
2. API Key가 유효한지 확인
3. 테이블 권한 설정 확인

### 성능 이슈 시:
1. 인덱스가 올바르게 생성되었는지 확인
2. 쿼리 최적화 검토
3. Supabase Dashboard에서 성능 모니터링