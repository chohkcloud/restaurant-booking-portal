# 엔티티 정의서
## Restaurant Booking Portal System

### 📋 문서 정보
- **작성일**: 2025.09.06
- **버전**: v1.0
- **프로젝트**: 식당 예약 포털 시스템
- **데이터베이스**: PostgreSQL (Supabase)

---

## 🗄️ 데이터베이스 스키마 구조

### ERD (Entity Relationship Diagram)
```
┌─────────────┐     ┌─────────────────┐     ┌──────────────┐
│   users     │────▶│   reservations  │◀────│ restaurants  │
│             │ 1:N │                 │ N:1 │              │
│ - id        │     │ - id            │     │ - id         │
│ - email     │     │ - user_id       │     │ - name       │
│ - name      │     │ - restaurant_id │     │ - slug       │
│ - phone     │     │ - date          │     │ - category   │
└─────────────┘     │ - time          │     └──────────────┘
                    │ - party_size    │              │
┌─────────────┐     │ - status        │              │ N:1
│   reviews   │     └─────────────────┘              ▼
│             │                                ┌──────────────┐
│ - id        │◀──────────────────────────────│ categories   │
│ - user_id   │                          N:1  │              │
│ - rest_id   │                               │ - id         │
│ - rating    │                               │ - name       │
│ - title     │                               │ - icon       │
│ - content   │                               └──────────────┘
└─────────────┘                                      
        │                                            │
        └────────────────────────────────────────────┘
                              N:1
```

---

## 📊 엔티티 상세 정의

### 1. users (사용자)

#### 테이블 정보
- **물리명**: `users`
- **논리명**: 사용자
- **설명**: 시스템 사용자 정보 (Supabase Auth 연동)

#### 컬럼 정의
| 컬럼명 | 물리타입 | 논리타입 | 길이 | NULL | PK | FK | 기본값 | 설명 |
|--------|----------|----------|------|------|----|----|--------|------|
| id | uuid | UUID | - | N | Y | - | gen_random_uuid() | 사용자 ID |
| email | varchar | 이메일 | 255 | N | - | - | - | 이메일 주소 (로그인 ID) |
| name | varchar | 이름 | 100 | N | - | - | - | 사용자 이름 |
| phone | varchar | 전화번호 | 20 | Y | - | - | - | 휴대폰 번호 |
| created_at | timestamptz | 생성일시 | - | N | - | - | now() | 계정 생성 일시 |
| updated_at | timestamptz | 수정일시 | - | N | - | - | now() | 정보 수정 일시 |

#### 제약조건
```sql
-- Primary Key
ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Check Constraints  
ALTER TABLE users ADD CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
ALTER TABLE users ADD CONSTRAINT users_phone_format CHECK (phone ~* '^010-[0-9]{4}-[0-9]{4}$');
```

#### 인덱스
```sql
-- 이메일 검색용 인덱스
CREATE INDEX idx_users_email ON users(email);

-- 전화번호 검색용 인덱스 (부분)
CREATE INDEX idx_users_phone ON users(phone) WHERE phone IS NOT NULL;
```

---

### 2. categories (카테고리)

#### 테이블 정보
- **물리명**: `categories`
- **논리명**: 음식 카테고리
- **설명**: 식당 분류를 위한 카테고리 정보

#### 컬럼 정의
| 컬럼명 | 물리타입 | 논리타입 | 길이 | NULL | PK | FK | 기본값 | 설명 |
|--------|----------|----------|------|------|----|----|--------|------|
| id | uuid | UUID | - | N | Y | - | gen_random_uuid() | 카테고리 ID |
| name | varchar | 카테고리명 | 50 | N | - | - | - | 카테고리 이름 |
| icon | varchar | 아이콘 | 10 | Y | - | - | - | 이모지 아이콘 |
| description | text | 설명 | - | Y | - | - | - | 카테고리 설명 |
| sort_order | integer | 정렬순서 | - | N | - | - | 0 | 표시 순서 |
| created_at | timestamptz | 생성일시 | - | N | - | - | now() | 생성 일시 |

#### 제약조건
```sql
-- Primary Key
ALTER TABLE categories ADD CONSTRAINT categories_pkey PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE categories ADD CONSTRAINT categories_name_unique UNIQUE (name);

-- Check Constraints
ALTER TABLE categories ADD CONSTRAINT categories_sort_order_positive CHECK (sort_order >= 0);
```

#### 인덱스
```sql
-- 정렬 순서용 인덱스
CREATE INDEX idx_categories_sort_order ON categories(sort_order);
```

---

### 3. restaurants (식당)

#### 테이블 정보
- **물리명**: `restaurants`
- **논리명**: 식당
- **설명**: 식당 기본 정보 및 메타데이터

#### 컬럼 정의
| 컬럼명 | 물리타입 | 논리타입 | 길이 | NULL | PK | FK | 기본값 | 설명 |
|--------|----------|----------|------|------|----|----|--------|------|
| id | uuid | UUID | - | N | Y | - | gen_random_uuid() | 식당 ID |
| name | varchar | 식당명 | 100 | N | - | - | - | 식당 이름 |
| slug | varchar | 슬러그 | 100 | N | - | - | - | URL용 고유 식별자 |
| description | text | 설명 | - | Y | - | - | - | 식당 소개 |
| category_id | uuid | 카테고리ID | - | N | - | Y | - | 카테고리 외래키 |
| address | text | 주소 | - | Y | - | - | - | 전체 주소 |
| phone | varchar | 전화번호 | 20 | Y | - | - | - | 식당 연락처 |
| image_url | text | 이미지URL | - | Y | - | - | - | 대표 이미지 |
| price_range | varchar | 가격대 | 10 | Y | - | - | - | ₩, ₩₩, ₩₩₩ |
| opening_hours | varchar | 영업시간 | 50 | Y | - | - | - | 영업 시간 |
| rating | numeric(3,2) | 평점 | - | N | - | - | 0.00 | 평균 평점 (0.00-5.00) |
| total_reviews | integer | 리뷰수 | - | N | - | - | 0 | 총 리뷰 개수 |
| created_at | timestamptz | 생성일시 | - | N | - | - | now() | 생성 일시 |
| updated_at | timestamptz | 수정일시 | - | N | - | - | now() | 수정 일시 |

#### 제약조건
```sql
-- Primary Key
ALTER TABLE restaurants ADD CONSTRAINT restaurants_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE restaurants ADD CONSTRAINT restaurants_category_id_fkey 
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT;

-- Unique Constraints
ALTER TABLE restaurants ADD CONSTRAINT restaurants_slug_unique UNIQUE (slug);

-- Check Constraints
ALTER TABLE restaurants ADD CONSTRAINT restaurants_rating_range CHECK (rating >= 0.00 AND rating <= 5.00);
ALTER TABLE restaurants ADD CONSTRAINT restaurants_total_reviews_positive CHECK (total_reviews >= 0);
ALTER TABLE restaurants ADD CONSTRAINT restaurants_price_range_valid CHECK (price_range IN ('₩', '₩₩', '₩₩₩'));
```

#### 인덱스
```sql
-- 슬러그 검색용 인덱스
CREATE INDEX idx_restaurants_slug ON restaurants(slug);

-- 카테고리별 검색용 인덱스
CREATE INDEX idx_restaurants_category_id ON restaurants(category_id);

-- 평점순 정렬용 인덱스
CREATE INDEX idx_restaurants_rating_desc ON restaurants(rating DESC);

-- 복합 인덱스 (카테고리 + 평점)
CREATE INDEX idx_restaurants_category_rating ON restaurants(category_id, rating DESC);

-- 전문 검색용 인덱스
CREATE INDEX idx_restaurants_search ON restaurants USING gin(to_tsvector('korean', name || ' ' || COALESCE(description, '')));
```

---

### 4. restaurant_menus (메뉴)

#### 테이블 정보
- **물리명**: `restaurant_menus`
- **논리명**: 식당 메뉴
- **설명**: 각 식당의 메뉴 정보

#### 컬럼 정의
| 컬럼명 | 물리타입 | 논리타입 | 길이 | NULL | PK | FK | 기본값 | 설명 |
|--------|----------|----------|------|------|----|----|--------|------|
| id | uuid | UUID | - | N | Y | - | gen_random_uuid() | 메뉴 ID |
| restaurant_id | uuid | 식당ID | - | N | - | Y | - | 식당 외래키 |
| name | varchar | 메뉴명 | 100 | N | - | - | - | 메뉴 이름 |
| description | text | 설명 | - | Y | - | - | - | 메뉴 설명 |
| price | integer | 가격 | - | N | - | - | - | 메뉴 가격 (원) |
| category | varchar | 메뉴카테고리 | 50 | Y | - | - | - | 메뉴 분류 |
| image_url | text | 이미지URL | - | Y | - | - | - | 메뉴 이미지 |
| is_popular | boolean | 인기메뉴여부 | - | N | - | - | false | 인기 메뉴 표시 |
| is_available | boolean | 판매가능여부 | - | N | - | - | true | 품절 여부 |
| created_at | timestamptz | 생성일시 | - | N | - | - | now() | 생성 일시 |
| updated_at | timestamptz | 수정일시 | - | N | - | - | now() | 수정 일시 |

#### 제약조건
```sql
-- Primary Key
ALTER TABLE restaurant_menus ADD CONSTRAINT restaurant_menus_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE restaurant_menus ADD CONSTRAINT restaurant_menus_restaurant_id_fkey 
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

-- Check Constraints
ALTER TABLE restaurant_menus ADD CONSTRAINT restaurant_menus_price_positive CHECK (price > 0);
```

#### 인덱스
```sql
-- 식당별 메뉴 조회용 인덱스
CREATE INDEX idx_restaurant_menus_restaurant_id ON restaurant_menus(restaurant_id);

-- 인기 메뉴 조회용 인덱스
CREATE INDEX idx_restaurant_menus_popular ON restaurant_menus(restaurant_id, is_popular) 
  WHERE is_popular = true;

-- 판매 가능 메뉴 조회용 인덱스
CREATE INDEX idx_restaurant_menus_available ON restaurant_menus(restaurant_id, is_available)
  WHERE is_available = true;
```

---

### 5. reservations (예약)

#### 테이블 정보
- **물리명**: `reservations`
- **논리명**: 예약
- **설명**: 고객의 식당 예약 정보

#### 컬럼 정의
| 컬럼명 | 물리타입 | 논리타입 | 길이 | NULL | PK | FK | 기본값 | 설명 |
|--------|----------|----------|------|------|----|----|--------|------|
| id | uuid | UUID | - | N | Y | - | gen_random_uuid() | 예약 ID |
| user_id | uuid | 사용자ID | - | N | - | Y | - | 사용자 외래키 |
| restaurant_id | uuid | 식당ID | - | N | - | Y | - | 식당 외래키 |
| date | varchar | 예약날짜 | 50 | N | - | - | - | 예약 날짜 (문자열) |
| time | varchar | 예약시간 | 10 | N | - | - | - | 예약 시간 |
| party_size | integer | 인원수 | - | N | - | - | - | 예약 인원 |
| customer_name | varchar | 예약자명 | 100 | N | - | - | - | 예약자 이름 |
| customer_email | varchar | 예약자이메일 | 255 | N | - | - | - | 예약자 이메일 |
| customer_phone | varchar | 예약자전화 | 20 | N | - | - | - | 예약자 전화번호 |
| special_request | text | 특별요청 | - | Y | - | - | - | 특별 요청사항 |
| status | varchar | 예약상태 | 20 | N | - | - | 'confirmed' | 예약 상태 |
| created_at | timestamptz | 생성일시 | - | N | - | - | now() | 예약 신청 일시 |
| updated_at | timestamptz | 수정일시 | - | N | - | - | now() | 예약 수정 일시 |

#### 제약조건
```sql
-- Primary Key
ALTER TABLE reservations ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE reservations ADD CONSTRAINT reservations_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT;
  
ALTER TABLE reservations ADD CONSTRAINT reservations_restaurant_id_fkey 
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE RESTRICT;

-- Check Constraints
ALTER TABLE reservations ADD CONSTRAINT reservations_party_size_range CHECK (party_size BETWEEN 1 AND 20);
ALTER TABLE reservations ADD CONSTRAINT reservations_status_valid 
  CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show'));
ALTER TABLE reservations ADD CONSTRAINT reservations_email_format 
  CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

#### 인덱스
```sql
-- 사용자별 예약 조회용 인덱스
CREATE INDEX idx_reservations_user_id ON reservations(user_id, created_at DESC);

-- 식당별 예약 조회용 인덱스
CREATE INDEX idx_reservations_restaurant_id ON reservations(restaurant_id, date, time);

-- 예약 상태별 인덱스
CREATE INDEX idx_reservations_status ON reservations(status, created_at DESC);

-- 예약 중복 체크용 복합 인덱스
CREATE INDEX idx_reservations_conflict_check ON reservations(restaurant_id, date, time)
  WHERE status = 'confirmed';
```

---

### 6. reviews (리뷰)

#### 테이블 정보
- **물리명**: `reviews`
- **논리명**: 리뷰
- **설명**: 고객의 식당 리뷰 및 평점

#### 컬럼 정의
| 컬럼명 | 물리타입 | 논리타입 | 길이 | NULL | PK | FK | 기본값 | 설명 |
|--------|----------|----------|------|------|----|----|--------|------|
| id | uuid | UUID | - | N | Y | - | gen_random_uuid() | 리뷰 ID |
| user_id | uuid | 사용자ID | - | N | - | Y | - | 사용자 외래키 |
| restaurant_id | uuid | 식당ID | - | N | - | Y | - | 식당 외래키 |
| title | varchar | 리뷰제목 | 200 | Y | - | - | - | 리뷰 제목 |
| content | text | 리뷰내용 | - | N | - | - | - | 리뷰 내용 |
| rating | integer | 평점 | - | N | - | - | - | 별점 (1-5) |
| created_at | timestamptz | 생성일시 | - | N | - | - | now() | 리뷰 작성 일시 |
| updated_at | timestamptz | 수정일시 | - | N | - | - | now() | 리뷰 수정 일시 |

#### 제약조건
```sql
-- Primary Key
ALTER TABLE reviews ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  
ALTER TABLE reviews ADD CONSTRAINT reviews_restaurant_id_fkey 
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

-- Unique Constraints (한 사용자당 식당마다 하나의 리뷰)
ALTER TABLE reviews ADD CONSTRAINT reviews_user_restaurant_unique 
  UNIQUE (user_id, restaurant_id);

-- Check Constraints
ALTER TABLE reviews ADD CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5);
ALTER TABLE reviews ADD CONSTRAINT reviews_content_length CHECK (char_length(content) BETWEEN 10 AND 1000);
```

#### 인덱스
```sql
-- 식당별 리뷰 조회용 인덱스
CREATE INDEX idx_reviews_restaurant_id ON reviews(restaurant_id, created_at DESC);

-- 사용자별 리뷰 조회용 인덱스
CREATE INDEX idx_reviews_user_id ON reviews(user_id, created_at DESC);

-- 평점별 조회용 인덱스
CREATE INDEX idx_reviews_rating ON reviews(restaurant_id, rating);
```

---

### 7. events (이벤트)

#### 테이블 정보
- **물리명**: `events`
- **논리명**: 이벤트
- **설명**: 프로모션 및 할인 이벤트 정보

#### 컬럼 정의
| 컬럼명 | 물리타입 | 논리타입 | 길이 | NULL | PK | FK | 기본값 | 설명 |
|--------|----------|----------|------|------|----|----|--------|------|
| id | uuid | UUID | - | N | Y | - | gen_random_uuid() | 이벤트 ID |
| title | varchar | 제목 | 200 | N | - | - | - | 이벤트 제목 |
| description | text | 설명 | - | Y | - | - | - | 이벤트 설명 |
| restaurant_id | uuid | 식당ID | - | Y | - | Y | - | 대상 식당 (전체 이벤트면 null) |
| image_url | text | 이미지URL | - | Y | - | - | - | 이벤트 이미지 |
| start_date | date | 시작일 | - | N | - | - | - | 이벤트 시작일 |
| end_date | date | 종료일 | - | N | - | - | - | 이벤트 종료일 |
| discount_rate | integer | 할인율 | - | Y | - | - | - | 할인율 (%) |
| is_active | boolean | 활성화여부 | - | N | - | - | true | 활성화 상태 |
| created_at | timestamptz | 생성일시 | - | N | - | - | now() | 생성 일시 |
| updated_at | timestamptz | 수정일시 | - | N | - | - | now() | 수정 일시 |

#### 제약조건
```sql
-- Primary Key
ALTER TABLE events ADD CONSTRAINT events_pkey PRIMARY KEY (id);

-- Foreign Keys
ALTER TABLE events ADD CONSTRAINT events_restaurant_id_fkey 
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE;

-- Check Constraints
ALTER TABLE events ADD CONSTRAINT events_date_valid CHECK (start_date <= end_date);
ALTER TABLE events ADD CONSTRAINT events_discount_rate_range CHECK (discount_rate BETWEEN 0 AND 100);
```

#### 인덱스
```sql
-- 활성 이벤트 조회용 인덱스
CREATE INDEX idx_events_active ON events(is_active, start_date, end_date)
  WHERE is_active = true;

-- 식당별 이벤트 조회용 인덱스
CREATE INDEX idx_events_restaurant_id ON events(restaurant_id, start_date DESC)
  WHERE restaurant_id IS NOT NULL;

-- 전체 이벤트 조회용 인덱스
CREATE INDEX idx_events_global ON events(start_date DESC)
  WHERE restaurant_id IS NULL;
```

---

## 🔗 뷰 (Views)

### 1. restaurant_stats (식당 통계 뷰)
```sql
CREATE VIEW restaurant_stats AS
SELECT 
    r.id,
    r.name,
    r.slug,
    r.rating,
    r.total_reviews,
    COUNT(DISTINCT res.id) as total_reservations,
    COUNT(DISTINCT res.id) FILTER (WHERE res.status = 'completed') as completed_reservations,
    COUNT(DISTINCT rm.id) as total_menus
FROM restaurants r
LEFT JOIN reservations res ON r.id = res.restaurant_id
LEFT JOIN restaurant_menus rm ON r.id = rm.restaurant_id
GROUP BY r.id, r.name, r.slug, r.rating, r.total_reviews;
```

### 2. user_activity (사용자 활동 뷰)
```sql
CREATE VIEW user_activity AS
SELECT 
    u.id,
    u.name,
    u.email,
    COUNT(DISTINCT res.id) as total_reservations,
    COUNT(DISTINCT rev.id) as total_reviews,
    MAX(res.created_at) as last_reservation_at,
    MAX(rev.created_at) as last_review_at
FROM users u
LEFT JOIN reservations res ON u.id = res.user_id
LEFT JOIN reviews rev ON u.id = rev.user_id
GROUP BY u.id, u.name, u.email;
```

---

## 🛡️ 보안 정책 (RLS - Row Level Security)

### 1. users 테이블 RLS
```sql
-- RLS 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 사용자는 본인 정보만 조회 가능
CREATE POLICY users_select_policy ON users FOR SELECT 
  USING (auth.uid() = id);

-- 사용자는 본인 정보만 수정 가능
CREATE POLICY users_update_policy ON users FOR UPDATE 
  USING (auth.uid() = id);
```

### 2. reservations 테이블 RLS
```sql
-- RLS 활성화
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 사용자는 본인 예약만 조회 가능
CREATE POLICY reservations_select_policy ON reservations FOR SELECT 
  USING (auth.uid() = user_id);

-- 사용자는 본인 예약만 생성 가능
CREATE POLICY reservations_insert_policy ON reservations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 본인 예약만 수정 가능
CREATE POLICY reservations_update_policy ON reservations FOR UPDATE 
  USING (auth.uid() = user_id);
```

### 3. reviews 테이블 RLS
```sql
-- RLS 활성화
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 리뷰 조회 가능
CREATE POLICY reviews_select_policy ON reviews FOR SELECT 
  USING (true);

-- 로그인한 사용자만 리뷰 생성 가능
CREATE POLICY reviews_insert_policy ON reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 사용자는 본인 리뷰만 수정/삭제 가능
CREATE POLICY reviews_update_policy ON reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY reviews_delete_policy ON reviews FOR DELETE 
  USING (auth.uid() = user_id);
```

---

## 🗂️ 데이터 딕셔너리

### 공통 데이터 타입
| 타입명 | 설명 | 예시 |
|--------|------|------|
| uuid | UUID v4 형식 | 550e8400-e29b-41d4-a716-446655440000 |
| timestamptz | UTC 타임스탬프 | 2025-09-06T10:00:00.000Z |
| varchar(n) | 가변 길이 문자열 | "홍길동" |
| text | 긴 텍스트 | "맛있는 음식을 제공하는..." |
| numeric(p,s) | 정밀 소수 | 4.25 (precision=3, scale=2) |
| integer | 32비트 정수 | 12000 |
| boolean | 참/거짓 | true, false |
| date | 날짜만 | 2025-09-06 |

### 도메인 특화 타입
| 도메인 | 형식 | 예시 | 검증 규칙 |
|--------|------|------|----------|
| 이메일 | varchar(255) | user@example.com | RFC 5322 형식 |
| 전화번호 | varchar(20) | 010-1234-5678 | 010-XXXX-XXXX 형식 |
| 가격대 | varchar(10) | ₩₩ | ₩, ₩₩, ₩₩₩ 중 하나 |
| 예약상태 | varchar(20) | confirmed | confirmed, cancelled, completed, no_show |
| 평점 | integer | 4 | 1-5 범위 |
| 할인율 | integer | 20 | 0-100 범위 |

---

## 📊 성능 최적화

### 인덱스 전략
1. **기본키 인덱스**: 모든 테이블 자동 생성
2. **외래키 인덱스**: 조인 성능 향상
3. **검색 인덱스**: 자주 검색되는 컬럼
4. **복합 인덱스**: 복합 조건 검색 최적화
5. **부분 인덱스**: 조건부 데이터만 인덱싱

### 쿼리 최적화
1. **EXPLAIN ANALYZE** 활용한 쿼리 분석
2. **적절한 LIMIT** 사용으로 메모리 효율성
3. **서브쿼리보다 JOIN** 선호
4. **인덱스 힌트** 활용 (필요시)

---

## 🔄 데이터 마이그레이션

### 마이그레이션 스크립트 예시
```sql
-- 01_create_users_table.sql
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email varchar(255) NOT NULL UNIQUE,
  name varchar(100) NOT NULL,
  phone varchar(20),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 트리거: 자동 updated_at 갱신
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at_trigger
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 시드 데이터
```sql
-- categories 시드 데이터
INSERT INTO categories (name, icon, sort_order) VALUES
('한식', '🍖', 1),
('중식', '🥟', 2),
('일식', '🍣', 3),
('양식', '🍝', 4),
('이탈리안', '🍕', 5),
('패스트푸드', '🍔', 6),
('카페', '☕', 7),
('디저트', '🍰', 8);
```

---

*최종 업데이트: 2025년 9월 6일*  
*버전: v1.0*