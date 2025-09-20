# 도메인 정의서
## Restaurant Booking Portal System

### 📋 문서 정보
- **작성일**: 2025.09.06
- **버전**: v1.0
- **프로젝트**: 식당 예약 포털 시스템

---

## 🏢 비즈니스 도메인 개요

### 사업 영역
**식당 예약 중개 플랫폼**
- 고객과 식당을 연결하는 온라인 예약 서비스
- 식당 정보 제공 및 리뷰 서비스
- 관리자 도구를 통한 식당 및 메뉴 관리

### 핵심 가치 제안
1. **고객**: 간편한 식당 검색 및 예약
2. **식당**: 예약 관리 및 고객 유치
3. **플랫폼**: 수수료 기반 수익 모델

---

## 👥 도메인 액터 (Domain Actors)

### 1. 고객 (Customer)
**정의**: 식당을 예약하고 이용하는 일반 사용자

**특성**:
- 만 14세 이상 개인
- 이메일 및 휴대폰 보유 필수
- 결제 능력 보유

**주요 행위**:
- 회원가입 및 로그인
- 식당 검색 및 조회
- 예약 생성 및 관리
- 리뷰 작성 및 평점 부여
- 개인정보 관리

**권한**:
- 본인 예약 정보 조회/수정/취소
- 본인 리뷰 작성/수정/삭제
- 식당 정보 열람

### 2. 식당 (Restaurant)
**정의**: 예약 서비스를 이용하는 음식점 사업체

**특성**:
- 유효한 사업자등록증 보유
- 고정된 영업장소 운영
- 예약 접수 가능한 운영 시간

**주요 정보**:
- 상호명, 주소, 연락처
- 음식 카테고리 및 가격대
- 영업시간 및 휴무일
- 메뉴 정보

### 3. 관리자 (Administrator)
**정의**: 플랫폼을 운영하고 관리하는 시스템 관리자

**권한**:
- 식당 정보 CRUD
- 메뉴 정보 관리
- 카테고리 관리
- 이벤트 및 프로모션 관리
- 이미지 자료 관리
- 사용자 관리 (필요시)

---

## 🗂️ 도메인 엔터티 (Domain Entities)

### 1. 사용자 도메인 (User Domain)

#### User (사용자)
```
사용자 기본 정보
- ID (UUID)
- 이메일 (고유값, 로그인 ID)
- 이름 (실명)
- 전화번호 (인증용)
- 생성일시
- 수정일시
```

### 2. 식당 도메인 (Restaurant Domain)

#### Restaurant (식당)
```
식당 기본 정보
- ID (UUID)
- 이름 (상호명)
- 슬러그 (URL용 고유 식별자)
- 설명 (소개문)
- 카테고리 ID (외래키)
- 주소 (전체 주소)
- 전화번호
- 이미지 URL
- 가격대 (₩, ₩₩, ₩₩₩)
- 영업시간
- 평점 (계산값)
- 총 리뷰 수 (계산값)
- 생성일시
- 수정일시
```

#### Category (카테고리)
```
음식 카테고리 정보
- ID (UUID)
- 이름 (한식, 중식, 일식 등)
- 아이콘 (이모지 또는 아이콘 코드)
- 설명
- 정렬 순서
- 생성일시
```

#### RestaurantMenu (메뉴)
```
식당 메뉴 정보
- ID (UUID)
- 식당 ID (외래키)
- 메뉴명
- 설명
- 가격
- 메뉴 카테고리 (ex: 메인, 사이드, 음료)
- 이미지 URL
- 인기 메뉴 여부
- 품절 여부
- 생성일시
- 수정일시
```

### 3. 예약 도메인 (Reservation Domain)

#### Reservation (예약)
```
예약 정보
- ID (UUID)
- 사용자 ID (외래키)
- 식당 ID (외래키)
- 예약 날짜 (문자열, "2025년 9월 6일 (금요일)")
- 예약 시간 (문자열, "18:30")
- 인원수
- 예약자 이름
- 예약자 이메일
- 예약자 전화번호
- 특별 요청사항
- 예약 상태 (confirmed, cancelled, completed, no_show)
- 생성일시 (예약 신청 시간)
- 수정일시
```

**예약 상태 정의**:
- `confirmed`: 예약 확정
- `cancelled`: 예약 취소
- `completed`: 이용 완료
- `no_show`: 노쇼 (미방문)

### 4. 리뷰 도메인 (Review Domain)

#### Review (리뷰)
```
리뷰 정보
- ID (UUID)
- 사용자 ID (외래키)
- 식당 ID (외래키)
- 제목 (선택)
- 내용
- 별점 (1-5)
- 생성일시
- 수정일시
```

### 5. 이벤트 도메인 (Event Domain)

#### Event (이벤트)
```
프로모션 이벤트 정보
- ID (UUID)
- 제목
- 설명
- 식당 ID (외래키, nullable)
- 시작일
- 종료일
- 할인율 (%)
- 이미지 URL
- 활성화 여부
- 생성일시
- 수정일시
```

---

## 🔄 도메인 관계 (Domain Relationships)

### 주요 관계도
```
User (1) -----> (N) Reservation
User (1) -----> (N) Review

Restaurant (1) -----> (N) Reservation
Restaurant (1) -----> (N) Review  
Restaurant (1) -----> (N) RestaurantMenu
Restaurant (N) -----> (1) Category

Event (N) -----> (1) Restaurant (optional)
```

### 관계 상세 설명

#### User ↔ Reservation
- **관계**: 1:N (한 사용자가 여러 예약 가능)
- **외래키**: Reservation.user_id → User.id
- **제약조건**: 사용자 삭제 시 예약 정보 유지 (soft delete)

#### User ↔ Review  
- **관계**: 1:N (한 사용자가 여러 리뷰 작성 가능)
- **외래키**: Review.user_id → User.id
- **제약조건**: 한 사용자가 같은 식당에 중복 리뷰 불가

#### Restaurant ↔ Reservation
- **관계**: 1:N (한 식당이 여러 예약 접수)
- **외래키**: Reservation.restaurant_id → Restaurant.id
- **제약조건**: 식당 삭제 시 예약 정보 유지

#### Restaurant ↔ Category
- **관계**: N:1 (여러 식당이 하나의 카테고리)
- **외래키**: Restaurant.category_id → Category.id
- **제약조건**: 카테고리는 필수값

#### Restaurant ↔ RestaurantMenu
- **관계**: 1:N (한 식당이 여러 메뉴 보유)
- **외래키**: RestaurantMenu.restaurant_id → Restaurant.id
- **제약조건**: 식당 삭제 시 메뉴도 함께 삭제

---

## 📊 도메인 규칙 (Domain Rules)

### 사용자 도메인 규칙
1. **이메일 유일성**: 시스템 내 이메일 중복 불가
2. **전화번호 형식**: 한국 휴대폰 번호 형식 (010-XXXX-XXXX)
3. **이름 길이**: 최소 2자, 최대 50자
4. **비밀번호**: 최소 8자, 영문+숫자 조합

### 식당 도메인 규칙
1. **슬러그 유일성**: URL용 슬러그는 시스템 내 유일값
2. **영업시간 형식**: "HH:MM-HH:MM" 24시간 형식
3. **가격대 범위**: ₩ (저렴), ₩₩ (보통), ₩₩₩ (비싸)
4. **평점 계산**: 모든 리뷰의 평균값, 소수점 첫째자리

### 예약 도메인 규칙
1. **예약 시간**: 영업시간 내에서만 예약 가능
2. **과거 예약 불가**: 현재 시점 이후 날짜만 예약 가능
3. **인원수 범위**: 최소 1명, 최대 20명
4. **중복 예약 방지**: 같은 시간대 같은 테이블 중복 예약 불가

### 리뷰 도메인 규칙
1. **평점 범위**: 1점 ~ 5점 (정수)
2. **중복 리뷰 금지**: 한 사용자가 같은 식당에 하나의 리뷰만
3. **내용 길이**: 최소 10자, 최대 1000자
4. **수정 제한**: 작성 후 24시간 내 수정 가능

### 이벤트 도메인 규칙
1. **기간 유효성**: 시작일 ≤ 종료일
2. **할인율 범위**: 0% ~ 100%
3. **중복 이벤트**: 같은 식당, 같은 기간 중복 이벤트 불가

---

## 🎯 도메인 서비스 (Domain Services)

### 1. 예약 관리 서비스 (ReservationService)
**책임**:
- 예약 가능 시간 확인
- 예약 생성 및 검증
- 예약 취소 처리
- 예약 상태 변경

**주요 메서드**:
```typescript
- createReservation(reservationData): Promise<Reservation>
- cancelReservation(reservationId, userId): Promise<boolean>
- checkAvailability(restaurantId, date, time): Promise<boolean>
- updateReservationStatus(reservationId, status): Promise<boolean>
```

### 2. 평점 계산 서비스 (RatingService)
**책임**:
- 식당 평균 평점 계산
- 리뷰 통계 생성
- 평점 기반 랭킹 계산

**주요 메서드**:
```typescript
- calculateAverageRating(restaurantId): Promise<number>
- updateRestaurantRating(restaurantId): Promise<void>
- getRatingDistribution(restaurantId): Promise<RatingStats>
```

### 3. 알림 서비스 (NotificationService)
**책임**:
- 예약 확인 이메일 발송
- SMS 알림 발송
- 예약 리마인더 발송

**주요 메서드**:
```typescript
- sendReservationConfirmation(reservation): Promise<boolean>
- sendReservationReminder(reservation): Promise<boolean>
- sendCancellationNotice(reservation): Promise<boolean>
```

---

## 📈 도메인 이벤트 (Domain Events)

### 1. 예약 관련 이벤트
- `ReservationCreated`: 예약 생성 시
- `ReservationCancelled`: 예약 취소 시
- `ReservationCompleted`: 예약 이용 완료 시
- `ReservationNoShow`: 노쇼 처리 시

### 2. 리뷰 관련 이벤트
- `ReviewCreated`: 리뷰 작성 시
- `ReviewUpdated`: 리뷰 수정 시
- `ReviewDeleted`: 리뷰 삭제 시

### 3. 사용자 관련 이벤트
- `UserRegistered`: 신규 회원가입 시
- `UserProfileUpdated`: 프로필 수정 시

---

## 🔒 도메인 보안 규칙

### 데이터 접근 권한
1. **개인정보**: 본인 또는 관리자만 접근 가능
2. **예약정보**: 예약자 본인 또는 해당 식당, 관리자만 접근
3. **리뷰정보**: 작성자 본인만 수정/삭제 가능
4. **식당정보**: 관리자만 수정 가능, 일반 사용자는 조회만

### 데이터 검증
1. **입력값 검증**: 모든 사용자 입력 데이터 서버 측 검증
2. **SQL 인젝션 방지**: 파라미터화된 쿼리 사용
3. **XSS 방지**: HTML 태그 이스케이프 처리
4. **CSRF 방지**: CSRF 토큰 사용

---

## 📊 도메인 메트릭 (Domain Metrics)

### 비즈니스 메트릭
- **활성 사용자 수** (DAU, MAU)
- **예약 건수** (일/월/년)
- **예약 취소율**
- **노쇼율**
- **평균 리뷰 점수**
- **식당 등록 수**

### 기술 메트릭  
- **API 응답 시간**
- **데이터베이스 쿼리 성능**
- **에러율**
- **시스템 가용률**

---

*최종 업데이트: 2025년 9월 6일*  
*버전: v1.0*