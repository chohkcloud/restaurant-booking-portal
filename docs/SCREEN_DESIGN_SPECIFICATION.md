# 화면 설계서
## Restaurant Booking Portal System

### 📋 문서 정보
- **작성일**: 2025.09.06
- **버전**: v1.0
- **프로젝트**: 식당 예약 포털 시스템
- **URL**: https://restaurant-booking-portal.vercel.app

---

## 🎨 디자인 시스템

### 컬러 팔레트
```css
/* Primary Colors */
--primary-orange: #ff6b35        /* 메인 브랜드 컬러 */
--primary-red: #f55336          /* 그라데이션 보조 컬러 */

/* Background Colors */
--bg-primary: #fff1ee           /* 메인 배경 (연한 오렌지) */
--bg-secondary: #ffe4de         /* 보조 배경 (더 연한 오렌지) */
--bg-white: #ffffff             /* 카드/모달 배경 */

/* Text Colors */
--text-primary: #1F2937         /* 주요 텍스트 (다크 그레이) */
--text-secondary: #6B7280       /* 보조 텍스트 (미디엄 그레이) */
--text-muted: #9CA3AF           /* 부가 텍스트 (라이트 그레이) */

/* Border Colors */
--border-light: #E5E7EB         /* 연한 테두리 */
--border-medium: #D1D5DB        /* 중간 테두리 */
--border-primary: #ff6b35       /* 강조 테두리 */

/* Status Colors */
--success: #10B981              /* 성공/확인 */
--warning: #F59E0B              /* 경고/주의 */
--error: #EF4444                /* 에러/위험 */
--info: #3B82F6                 /* 정보/링크 */
```

### 타이포그래피
```css
/* Headings */
h1: font-size: 2rem (32px), font-weight: bold
h2: font-size: 1.875rem (30px), font-weight: bold  
h3: font-size: 1.5rem (24px), font-weight: 600
h4: font-size: 1.25rem (20px), font-weight: 600
h5: font-size: 1.125rem (18px), font-weight: 600

/* Body Text */
body: font-size: 1rem (16px), font-weight: 400
small: font-size: 0.875rem (14px), font-weight: 400
tiny: font-size: 0.75rem (12px), font-weight: 400

/* Button Text */
button: font-size: 0.95rem (15px), font-weight: 600
```

### 그라데이션 및 효과
```css
/* Primary Gradient */
background: linear-gradient(135deg, #ff6b35 0%, #f55336 100%);

/* Background Gradient */
background: linear-gradient(135deg, #fff1ee 0%, #ffe4de 100%);

/* Box Shadows */
--shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
--shadow-md: 0 4px 15px rgba(255, 107, 53, 0.2);
--shadow-lg: 0 10px 30px rgba(255, 107, 53, 0.15);
--shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.3);

/* Border Radius */
--radius-sm: 0.5rem (8px);
--radius-md: 0.75rem (12px); 
--radius-lg: 1rem (16px);
--radius-xl: 1.5rem (24px);
--radius-full: 50% (원형);
```

---

## 📱 페이지별 화면 설계

### 1. 메인 페이지 (/)

#### 레이아웃 구조
```
┌─────────────────────────────────────┐
│ Header (로그인 버튼)                    │
├─────────────────────────────────────┤
│ Search Bar (검색창)                   │
│ Current Location (현재 위치)           │  
├─────────────────────────────────────┤
│ Category Grid (카테고리 그리드)          │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ 🍕  │ │ 🍣  │ │ 🍖  │ │ 🍔  │   │
│ │이탈리│ │일식  │ │한식  │ │패스트│   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│ Featured Restaurants (추천 맛집)      │
│ ┌─────────────┐ ┌─────────────┐   │
│ │ Restaurant  │ │ Restaurant  │   │
│ │ Card 1      │ │ Card 2      │   │
│ └─────────────┘ └─────────────┘   │
├─────────────────────────────────────┤
│ Footer                             │
└─────────────────────────────────────┘
```

#### 주요 컴포넌트

**Header**
- 배경: `--bg-white`
- 그림자: `--shadow-sm`
- 높이: 80px
- 로그인 버튼: 우측 상단, 오렌지 그라데이션

**검색창**
- 배경: `--bg-white`
- 테두리: 2px solid `--border-primary`
- 둥근 모서리: 2rem (완전 둥근 형태)
- 그림자: `--shadow-md`
- 호버 효과: 위로 2px 이동, 그림자 강화

**카테고리 그리드**
- 배경: 오렌지 그라데이션
- 그리드: 4열 반응형 (모바일에서 2열)
- 카드 크기: 120px × 120px
- 아이콘: 40px, 이모지
- 호버 효과: 스케일 1.05 확대

**레스토랑 카드**
- 크기: 320px × 280px
- 둥근 모서리: `--radius-xl`
- 그림자: `--shadow-lg`
- 이미지 높이: 180px
- 호버 효과: 위로 8px 이동, 그림자 강화

### 2. 레스토랑 목록 페이지 (/restaurants)

#### 레이아웃 구조
```
┌─────────────────────────────────────┐
│ Header with Search                  │
├─────────────────────────────────────┤
│ Filter Bar (필터 바)                 │
│ [카테고리▼] [정렬▼] [가격대▼]        │
├─────────────────────────────────────┤
│ Restaurant List (레스토랑 목록)       │
│ ┌─────────────────────────────────┐ │
│ │ Restaurant Item 1               │ │
│ │ [이미지] [정보] [평점] [예약버튼]  │ │
│ ├─────────────────────────────────┤ │
│ │ Restaurant Item 2               │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Pagination (페이지네이션)             │
└─────────────────────────────────────┘
```

#### 주요 컴포넌트

**필터 바**
- 높이: 60px
- 배경: `--bg-white`
- 버튼: 드롭다운 형태, 테두리 포함
- 선택된 필터: 오렌지 배경

**레스토랑 리스트 아이템**
- 높이: 120px (데스크톱), 160px (모바일)
- 레이아웃: 수평형 (이미지 + 정보)
- 이미지: 120px × 120px (정사각형)
- 예약 버튼: 우측, 오렌지 그라데이션

### 3. 레스토랑 상세 페이지 (/restaurant/[slug])

#### 레이아웃 구조
```
┌─────────────────────────────────────┐
│ Header Image (헤더 이미지)           │
│ [뒤로가기] [공유] [좋아요]           │
├─────────────────────────────────────┤
│ Restaurant Info Card                │
│ ┌─────────────────────────────────┐ │
│ │ [이름] [설명] [평점] [예약버튼]   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Tab Navigation                      │
│ [🍽️메뉴] [⭐리뷰] [📍매장정보]      │
├─────────────────────────────────────┤
│ Tab Content (탭 내용)                │
│ • 메뉴: 메뉴 리스트                  │
│ • 리뷰: 리뷰 리스트 + 작성 버튼      │
│ • 매장정보: 주소, 전화, 시설        │
└─────────────────────────────────────┘
```

#### 주요 컴포넌트

**헤더 이미지**
- 높이: 160px (모바일), 200px (데스크톱)
- 그라데이션 오버레이: `from-black/50 to-black/10`
- 버튼: 반투명 원형, 백드롭 필터

**레스토랑 정보 카드**
- 배경: `--bg-white`
- 테두리: 2px solid `--border-primary`
- 둥근 모서리: `--radius-xl`
- 패딩: 2rem
- 그림자: `--shadow-lg`

**예약 버튼**
- 크기: 중간 (padding: 0.75rem 1.5rem)
- 둥근 모서리: `--radius-lg`
- 그라데이션 배경, 화이트 텍스트
- 아이콘: 📅 CalendarIcon

**탭 메뉴**
- 높이: 48px
- 버튼 형태: 둥근 알약 모양 (2rem)
- 활성 탭: 오렌지 그라데이션 배경
- 비활성 탭: 화이트 배경, 그레이 테두리

### 4. 예약 페이지 (/reservation)

#### 레이아웃 구조
```
┌─────────────────────────────────────┐
│ Header (뒤로가기 + 제목)              │
│ [←] 예약하기 - 레스토랑명             │
├─────────────────────────────────────┤
│ Two Column Layout (2컬럼 레이아웃)    │
│ ┌─────────────┐ ┌─────────────────┐ │
│ │ Restaurant  │ │ Reservation     │ │
│ │ Info Card   │ │ Form Card       │ │
│ │             │ │                 │ │
│ │ [이미지]    │ │ [날짜 선택]     │ │
│ │ [기본정보]  │ │ [시간 선택]     │ │  
│ │ [연락처]    │ │ [인원수]        │ │
│ │ [영업시간]  │ │ [고객정보]      │ │
│ │             │ │ [특별요청]      │ │
│ │             │ │ [예약확정버튼]  │ │
│ └─────────────┘ └─────────────────┘ │
└─────────────────────────────────────┘
```

#### 주요 컴포넌트

**헤더**
- 뒤로가기 버튼: 원형, 3rem × 3rem, 오렌지 그라데이션
- 제목: 중앙 정렬, 1.5rem 볼드
- 고정 위치 (sticky), 화이트 배경

**레스토랑 정보 카드**
- 이미지: 200px 높이, 전체 너비
- 정보 섹션: 아이콘 + 텍스트 형태
- 배경: `--bg-white`, 테두리: `--border-primary`

**예약 폼 카드**
- 입력 필드: `calc(100% - 1.5rem)` 너비 (정렬 보정)
- 시간 선택: 3열 그리드, 스크롤 가능
- 인원수: +/- 버튼, 원형 디자인
- 예약 버튼: 전체 너비, 1rem 패딩, 큰 크기

### 5. 대시보드 페이지 (/dashboard)

#### 레이아웃 구조
```
┌─────────────────────────────────────┐
│ Header (사용자 정보)                 │
├─────────────────────────────────────┤
│ Quick Stats (빠른 통계)              │
│ [예약 건수] [리뷰 수] [즐겨찾기]     │
├─────────────────────────────────────┤
│ Tab Navigation                      │
│ [📅예약내역] [⭐내리뷰] [⚙️설정]     │
├─────────────────────────────────────┤
│ Tab Content                         │
│ • 예약내역: 예약 리스트 + 상태       │
│ • 내 리뷰: 작성한 리뷰 목록         │
│ • 설정: 개인정보 수정               │
└─────────────────────────────────────┘
```

### 6. 관리자 페이지 (/admin)

#### 레이아웃 구조
```
┌─────────────────────────────────────┐
│ Admin Header (관리자 헤더)           │
├─────────────────────────────────────┤
│ Navigation Tabs (네비게이션 탭)      │
│ [레스토랑] [메뉴] [이벤트] [이미지]  │
├─────────────────────────────────────┤
│ Management Interface (관리 인터페이스)│
│ • 레스토랑: CRUD 인터페이스          │
│ • 메뉴: 카테고리별 메뉴 관리         │
│ • 이벤트: 프로모션 이벤트 관리       │
│ • 이미지: 파일 업로드 관리           │
└─────────────────────────────────────┘
```

---

## 🎯 모달 및 팝업 설계

### 1. 로그인 모달

#### 구조
```
┌─────────────────────────────────────┐
│ Modal Background (반투명 배경)        │
│ ┌─────────────────────────────────┐ │
│ │ Modal Card                      │ │
│ │ ┌─────┐ ┌─────┐               │ │
│ │ │로그인│ │가입 │ [X]           │ │
│ │ └─────┘ └─────┘               │ │
│ │                               │ │
│ │ [이메일 입력]                  │ │
│ │ [비밀번호 입력]                │ │
│ │                               │ │
│ │ [로그인 버튼]                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### 스타일링
- 배경: `rgba(0, 0, 0, 0.5)` + 백드롭 필터
- 모달 크기: 최대 400px 너비, 자동 높이
- 둥근 모서리: `--radius-xl`
- 그림자: `--shadow-xl`
- 애니메이션: scale + opacity 전환

### 2. 리뷰 모달

#### 구조  
```
┌─────────────────────────────────────┐
│ Review Modal                        │
│ ┌─────────────────────────────────┐ │
│ │ 리뷰 작성하기           [X]     │ │
│ │ 레스토랑명                      │ │
│ │                               │ │
│ │ ⭐⭐⭐⭐⭐ (별점 선택)          │ │
│ │                               │ │
│ │ [리뷰 제목 입력]               │ │
│ │ [리뷰 내용 입력]               │ │
│ │                               │ │
│ │ [취소] [리뷰 등록]             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 📐 반응형 디자인

### 브레이크포인트
```css
/* Mobile First Approach */
/* Mobile: 0px ~ 767px */
@media (max-width: 767px) {
  - 단일 컬럼 레이아웃
  - 카테고리 그리드: 2열
  - 폰트 크기 축소
  - 터치 친화적 버튼 크기
}

/* Tablet: 768px ~ 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  - 2컬럼 레이아웃 (일부)
  - 카테고리 그리드: 3열
  - 중간 크기 컴포넌트
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  - 다중 컬럼 레이아웃
  - 카테고리 그리드: 4열
  - 최대 너비 제한 (1280px)
  - 호버 효과 활성화
}
```

### 모바일 최적화
- **터치 타겟**: 최소 44px × 44px
- **스크롤 영역**: 명확한 스크롤 인디케이터
- **네비게이션**: 하단 고정 (필요시)
- **폰트 크기**: 최소 16px (줌 방지)

---

## 🎨 애니메이션 및 인터랙션

### Framer Motion 애니메이션
```javascript
// 페이지 전환
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

// 카드 호버
const cardVariants = {
  hover: { 
    scale: 1.02, 
    y: -8,
    boxShadow: "0 20px 40px rgba(255, 107, 53, 0.2)" 
  }
}

// 모달 등장
const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 }
}
```

### CSS 트랜지션
```css
/* 기본 전환 효과 */
.transition-all {
  transition: all 0.2s ease;
}

.transition-colors {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}

.transition-transform {
  transition: transform 0.2s ease;
}

/* 호버 효과 */
.hover-scale:hover {
  transform: scale(1.05);
}

.hover-lift:hover {
  transform: translateY(-2px);
}
```

---

## 🔧 컴포넌트 스타일 가이드

### 버튼 스타일

#### Primary Button (주요 버튼)
```css
.btn-primary {
  background: linear-gradient(135deg, #ff6b35 0%, #f55336 100%);
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
}
```

#### Secondary Button (보조 버튼)
```css
.btn-secondary {
  background: white;
  color: #ff6b35;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: 2px solid #ff6b35;
  border-radius: 0.75rem;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #FFF5F3;
  transform: translateY(-1px);
}
```

### 입력 필드 스타일
```css
.input-field {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #E5E7EB;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #ff6b35;
}
```

### 카드 스타일
```css
.card {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.15);
  border: 2px solid #ff6b35;
  overflow: hidden;
  transition: all 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(255, 107, 53, 0.2);
}
```

---

## 📊 성능 최적화

### 이미지 최적화
- **포맷**: WebP 우선, JPEG 백업
- **크기**: 반응형 이미지 (srcset 사용)
- **로딩**: 지연 로딩 (lazy loading)
- **압축**: 80% 품질 유지

### CSS 최적화
- **Critical CSS**: 첫 화면 CSS 인라인
- **번들 분할**: 페이지별 CSS 분할
- **압축**: 프로덕션 환경 압축
- **캐싱**: 장기 캐싱 헤더

### 애니메이션 최적화
- **GPU 가속**: transform3d 사용
- **will-change**: 애니메이션 요소에 적용
- **requestAnimationFrame**: 자바스크립트 애니메이션
- **reduce-motion**: 접근성 고려

---

## 🎯 사용성 (UX) 가이드라인

### 네비게이션
- **일관성**: 모든 페이지 동일한 네비게이션
- **명확성**: 현재 위치 명확히 표시
- **접근성**: 키보드 네비게이션 지원

### 피드백
- **로딩**: 로딩 인디케이터 표시
- **성공**: 성공 메시지 및 시각적 피드백
- **에러**: 명확한 에러 메시지 및 해결 방안

### 접근성 (A11y)
- **색상 대비**: WCAG 2.1 AA 준수
- **키보드**: 모든 기능 키보드 접근 가능
- **스크린 리더**: aria-label, alt 텍스트 제공
- **포커스**: 명확한 포커스 인디케이터

---

*최종 업데이트: 2025년 9월 6일*  
*버전: v1.0*