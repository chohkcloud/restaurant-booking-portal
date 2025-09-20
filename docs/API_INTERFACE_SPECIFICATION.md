# API 인터페이스 정의서
## Restaurant Booking Portal System

### 📋 문서 정보
- **작성일**: 2025.09.06
- **버전**: v1.0
- **프로젝트**: 식당 예약 포털 시스템
- **Base URL**: https://restaurant-booking-portal.vercel.app/api

---

## 🔐 인증 (Authentication)

### 인증 방식
- **Type**: JWT (JSON Web Token)
- **Provider**: Supabase Auth
- **Header**: `Authorization: Bearer {token}`

### 인증 토큰 획득
```javascript
// Supabase 클라이언트를 통한 인증
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

---

## 👤 사용자 인증 API

### 1. 회원가입
```http
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "phone": "010-1234-5678"
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "홍길동"
  }
}
```

### 2. 로그인
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com", 
  "password": "password123"
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "로그인 성공",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "홍길동",
    "phone": "010-1234-5678"
  },
  "session": {
    "access_token": "jwt-token",
    "expires_at": 1693975200
  }
}
```

---

## 🍽️ 레스토랑 API

### 1. 레스토랑 목록 조회
```http
GET /api/restaurants
Query Parameters:
- category: string (optional) - 카테고리 필터
- search: string (optional) - 검색어
- page: number (optional, default: 1) - 페이지 번호
- limit: number (optional, default: 20) - 페이지당 항목 수
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "restaurants": [
      {
        "id": "rest-uuid",
        "name": "맛있는 한식당",
        "slug": "delicious-korean",
        "description": "정통 한식을 선보이는...",
        "image_url": "https://...",
        "category": {
          "id": "cat-uuid",
          "name": "한식",
          "icon": "🍖"
        },
        "rating": 4.5,
        "total_reviews": 128,
        "price_range": "₩₩",
        "address": "서울시 강남구...",
        "phone": "02-123-4567",
        "opening_hours": "11:00-22:00"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_count": 95,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 2. 레스토랑 상세 조회
```http
GET /api/restaurants/{slug}
Path Parameters:
- slug: string - 레스토랑 슬러그
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "restaurant": {
      "id": "rest-uuid",
      "name": "맛있는 한식당",
      "slug": "delicious-korean",
      "description": "정통 한식을 선보이는...",
      "image_url": "https://...",
      "category": {
        "id": "cat-uuid",
        "name": "한식",
        "icon": "🍖"
      },
      "rating": 4.5,
      "total_reviews": 128,
      "price_range": "₩₩",
      "address": "서울시 강남구 테헤란로 123",
      "phone": "02-123-4567",
      "opening_hours": "11:00-22:00",
      "created_at": "2025-01-01T00:00:00Z"
    }
  }
}
```

### 3. 카테고리 목록 조회
```http
GET /api/categories
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat-uuid",
        "name": "한식",
        "icon": "🍖",
        "description": "전통 한국 요리",
        "restaurant_count": 25
      }
    ]
  }
}
```

---

## 🍜 메뉴 API

### 1. 레스토랑 메뉴 조회
```http
GET /api/restaurants/{restaurant_id}/menus
Path Parameters:
- restaurant_id: string - 레스토랑 ID
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "menus": [
      {
        "id": "menu-uuid",
        "name": "김치찌개",
        "description": "시원하고 얼큰한 김치찌개",
        "price": 12000,
        "image_url": "https://...",
        "is_popular": true,
        "category": "찌개류",
        "restaurant_id": "rest-uuid"
      }
    ]
  }
}
```

---

## 📅 예약 API

### 1. 예약 생성
```http
POST /api/reservations
Authorization: Bearer {token}
Content-Type: application/json

{
  "restaurant_id": "rest-uuid",
  "date": "2025년 9월 6일 (금요일)",
  "time": "18:30",
  "party_size": 4,
  "customer_name": "홍길동",
  "customer_email": "user@example.com",
  "customer_phone": "010-1234-5678",
  "special_request": "창가 자리로 부탁드립니다"
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "예약이 완료되었습니다",
  "data": {
    "reservation": {
      "id": "reservation-uuid",
      "restaurant_id": "rest-uuid",
      "user_id": "user-uuid",
      "date": "2025년 9월 6일 (금요일)",
      "time": "18:30",
      "party_size": 4,
      "customer_name": "홍길동",
      "customer_email": "user@example.com",
      "customer_phone": "010-1234-5678",
      "special_request": "창가 자리로 부탁드립니다",
      "status": "confirmed",
      "created_at": "2025-09-06T10:00:00Z"
    }
  }
}
```

### 2. 내 예약 목록 조회
```http
GET /api/reservations/my
Authorization: Bearer {token}
Query Parameters:
- status: string (optional) - 예약 상태 필터 (confirmed, cancelled, completed)
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "reservations": [
      {
        "id": "reservation-uuid",
        "restaurant": {
          "id": "rest-uuid",
          "name": "맛있는 한식당",
          "image_url": "https://..."
        },
        "date": "2025년 9월 6일 (금요일)",
        "time": "18:30",
        "party_size": 4,
        "status": "confirmed",
        "created_at": "2025-09-06T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 2,
      "total_count": 15
    }
  }
}
```

### 3. 예약 취소
```http
DELETE /api/reservations/{reservation_id}
Authorization: Bearer {token}
Path Parameters:
- reservation_id: string - 예약 ID
```

**Response (200)**
```json
{
  "success": true,
  "message": "예약이 취소되었습니다"
}
```

---

## ⭐ 리뷰 API

### 1. 리뷰 작성
```http
POST /api/reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "restaurant_id": "rest-uuid",
  "rating": 5,
  "title": "정말 맛있어요!",
  "content": "음식도 맛있고 서비스도 좋아서 만족했습니다. 다음에 또 올게요!"
}
```

**Response (201)**
```json
{
  "success": true,
  "message": "리뷰가 등록되었습니다",
  "data": {
    "review": {
      "id": "review-uuid",
      "restaurant_id": "rest-uuid", 
      "user_id": "user-uuid",
      "rating": 5,
      "title": "정말 맛있어요!",
      "content": "음식도 맛있고 서비스도 좋아서...",
      "created_at": "2025-09-06T15:30:00Z"
    }
  }
}
```

### 2. 레스토랑 리뷰 조회
```http
GET /api/reviews
Query Parameters:
- restaurant_id: string (required) - 레스토랑 ID
- page: number (optional, default: 1)
- limit: number (optional, default: 10)
- rating: number (optional) - 평점 필터 (1-5)
```

**Response (200)**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "review-uuid",
        "user": {
          "name": "홍길동"
        },
        "rating": 5,
        "title": "정말 맛있어요!",
        "content": "음식도 맛있고 서비스도 좋아서...",
        "created_at": "2025-09-06T15:30:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_count": 28
    },
    "statistics": {
      "average_rating": 4.2,
      "total_reviews": 28,
      "rating_distribution": {
        "5": 12,
        "4": 8,
        "3": 5,
        "2": 2,
        "1": 1
      }
    }
  }
}
```

---

## 📧 알림 API

### 1. 예약 확인 이메일 발송
```http
POST /api/send-email
Authorization: Bearer {token}
Content-Type: application/json

{
  "to": "user@example.com",
  "type": "reservation_confirmation",
  "data": {
    "customer_name": "홍길동",
    "restaurant_name": "맛있는 한식당",
    "date": "2025년 9월 6일 (금요일)",
    "time": "18:30",
    "party_size": 4,
    "reservation_id": "reservation-uuid"
  }
}
```

**Response (200)**
```json
{
  "success": true,
  "message": "이메일이 발송되었습니다",
  "data": {
    "email_id": "email-uuid",
    "sent_at": "2025-09-06T10:00:00Z"
  }
}
```

### 2. SMS 알림 발송 (개발 예정)
```http
POST /api/send-sms
Authorization: Bearer {token}
Content-Type: application/json

{
  "to": "010-1234-5678",
  "type": "reservation_reminder",
  "data": {
    "customer_name": "홍길동",
    "restaurant_name": "맛있는 한식당",
    "date": "2025년 9월 6일 (금요일)",
    "time": "18:30"
  }
}
```

---

## 👨‍💼 관리자 API

### 인증
- **Admin Token**: 관리자 전용 JWT 토큰 필요
- **Header**: `Authorization: Bearer {admin_token}`

### 1. 관리자 로그인
```http
POST /api/admin/auth/login
Content-Type: application/json

{
  "email": "admin@restaurant-portal.com",
  "password": "admin_password"
}
```

### 2. 레스토랑 생성
```http
POST /api/admin/restaurants
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "name": "새로운 레스토랑",
  "description": "맛있는 음식을 선보이는...",
  "category_id": "cat-uuid",
  "address": "서울시 강남구...",
  "phone": "02-123-4567",
  "opening_hours": "11:00-22:00",
  "price_range": "₩₩"
}
```

### 3. 메뉴 관리
```http
POST /api/admin/menu/items
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "restaurant_id": "rest-uuid",
  "name": "새로운 메뉴",
  "description": "맛있는 음식입니다",
  "price": 15000,
  "category": "메인 요리",
  "is_popular": false
}
```

### 4. 이벤트 관리
```http
POST /api/admin/events
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "title": "할인 이벤트",
  "description": "모든 메뉴 20% 할인",
  "restaurant_id": "rest-uuid",
  "start_date": "2025-09-01",
  "end_date": "2025-09-30",
  "discount_rate": 20
}
```

---

## 📄 공통 응답 형식

### 성공 응답
```json
{
  "success": true,
  "message": "요청이 성공했습니다",
  "data": {
    // 응답 데이터
  }
}
```

### 에러 응답
```json
{
  "success": false,
  "message": "에러 메시지",
  "error": {
    "code": "ERROR_CODE",
    "details": "상세 에러 정보"
  }
}
```

### HTTP 상태 코드
- **200 OK**: 요청 성공
- **201 Created**: 리소스 생성 성공
- **400 Bad Request**: 잘못된 요청
- **401 Unauthorized**: 인증 필요
- **403 Forbidden**: 권한 없음
- **404 Not Found**: 리소스 없음
- **500 Internal Server Error**: 서버 에러

---

## 🔍 에러 코드 정의

### 인증 관련 (AUTH_*)
- `AUTH_INVALID_CREDENTIALS`: 잘못된 인증 정보
- `AUTH_TOKEN_EXPIRED`: 토큰 만료
- `AUTH_TOKEN_INVALID`: 유효하지 않은 토큰
- `AUTH_EMAIL_ALREADY_EXISTS`: 이미 존재하는 이메일

### 예약 관련 (RESERVATION_*)
- `RESERVATION_TIME_UNAVAILABLE`: 예약 불가능한 시간
- `RESERVATION_NOT_FOUND`: 예약 정보 없음
- `RESERVATION_ALREADY_CANCELLED`: 이미 취소된 예약
- `RESERVATION_PAST_DATE`: 과거 날짜 예약 불가

### 리소스 관련 (RESOURCE_*)
- `RESTAURANT_NOT_FOUND`: 레스토랑 정보 없음
- `MENU_NOT_FOUND`: 메뉴 정보 없음
- `REVIEW_NOT_FOUND`: 리뷰 정보 없음
- `USER_NOT_FOUND`: 사용자 정보 없음

### 검증 관련 (VALIDATION_*)
- `VALIDATION_REQUIRED_FIELD`: 필수 필드 누락
- `VALIDATION_INVALID_EMAIL`: 잘못된 이메일 형식
- `VALIDATION_INVALID_PHONE`: 잘못된 전화번호 형식
- `VALIDATION_INVALID_RATING`: 잘못된 평점 범위 (1-5)

---

## 🛠️ 개발 도구

### API 테스트 도구
- **Postman Collection**: 준비 예정
- **Swagger UI**: https://restaurant-booking-portal.vercel.app/api/docs (개발 예정)

### SDK 및 라이브러리
- **JavaScript SDK**: Supabase Client
- **TypeScript 타입**: 프로젝트 내 types/ 폴더 참조

### 개발 환경
- **Base URL (Dev)**: http://localhost:3000/api
- **Base URL (Prod)**: https://restaurant-booking-portal.vercel.app/api

---

*최종 업데이트: 2025년 9월 6일*  
*버전: v1.0*