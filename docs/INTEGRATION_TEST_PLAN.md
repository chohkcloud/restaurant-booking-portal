# 통합테스트 계획서
## Restaurant Booking Portal System

### 📋 문서 정보
- **작성일**: 2025.09.06
- **버전**: v1.0
- **프로젝트**: 식당 예약 포털 시스템
- **테스트 관리자**: 개발팀
- **예상 기간**: 2025.09.07 ~ 2025.09.10 (4일)

---

## 🎯 통합테스트 목적

### 주요 목표
1. **시스템 구성요소 간 인터페이스 검증**
2. **데이터 플로우 정상 동작 확인** 
3. **API 연동 및 데이터베이스 무결성 검증**
4. **외부 서비스 연동 테스트** (이메일, SMS)
5. **전체 시스템 성능 및 안정성 검증**

### 테스트 범위
- **Frontend ↔ Backend API** 연동
- **Backend ↔ Database** 연동
- **External Services** 연동 (Supabase, 이메일 서비스)
- **User Flow** 전체 시나리오
- **Admin Flow** 관리 기능 전체

---

## 🏗️ 시스템 아키텍처 및 통합 포인트

### 통합 대상 컴포넌트
```
┌─────────────────┐    API     ┌─────────────────┐
│   Frontend      │◄──────────►│   Backend       │
│   (Next.js)     │   HTTP     │   (Next.js API) │
└─────────────────┘            └─────────────────┘
                                        │
                               ┌────────▼──────────┐
                               │   External        │
                               │   Services        │
                               │                   │
                               │ • Supabase DB     │
                               │ • Supabase Auth   │
                               │ • Email Service   │
                               │ • File Storage    │
                               └───────────────────┘
```

### 주요 통합 포인트
1. **클라이언트 ↔ API 서버** 통신
2. **API 서버 ↔ 데이터베이스** 연동
3. **인증 시스템** 연동 (Supabase Auth)
4. **파일 업로드** 연동 (Supabase Storage) 
5. **이메일 알림** 연동
6. **실시간 업데이트** 연동

---

## 📅 테스트 일정

### Phase 1: API 통합 테스트 (Day 1)
**일정**: 2025.09.07
**담당**: Backend 개발자
**내용**:
- REST API 엔드포인트 테스트
- 데이터베이스 CRUD 작업 검증
- 인증/인가 메커니즘 테스트

### Phase 2: 프론트엔드 통합 테스트 (Day 2)
**일정**: 2025.09.08  
**담당**: Frontend 개발자
**내용**:
- 컴포넌트 간 데이터 흐름 테스트
- 상태 관리 (Context API) 테스트
- 라우팅 및 네비게이션 테스트

### Phase 3: 엔드투엔드 시나리오 테스트 (Day 3)
**일정**: 2025.09.09
**담당**: QA 팀 (또는 풀스택 개발자)
**내용**:
- 사용자 플로우 전체 시나리오
- 관리자 플로우 전체 시나리오
- 에러 시나리오 및 예외 처리

### Phase 4: 성능 및 부하 테스트 (Day 4)
**일정**: 2025.09.10
**담당**: DevOps/Backend 개발자
**내용**:
- API 응답 시간 측정
- 동시 사용자 부하 테스트
- 데이터베이스 성능 최적화

---

## 🧪 통합테스트 시나리오

## Phase 1: API 통합 테스트

### IT-001: 사용자 인증 API 통합 테스트

#### 테스트 범위
- Supabase Auth 연동
- JWT 토큰 관리
- 세션 관리

#### 테스트 시나리오
```javascript
describe('Authentication Integration', () => {
  test('회원가입 → 이메일 인증 → 로그인 플로우', async () => {
    // 1. 회원가입 API 호출
    const signupResponse = await api.post('/api/auth/signup', {
      email: 'test@example.com',
      password: 'password123',
      name: '테스트 사용자',
      phone: '010-1234-5678'
    });
    
    expect(signupResponse.status).toBe(201);
    expect(signupResponse.data.success).toBe(true);
    
    // 2. 데이터베이스에서 사용자 생성 확인
    const user = await supabase
      .from('users')
      .select('*')
      .eq('email', 'test@example.com')
      .single();
      
    expect(user.data).toBeTruthy();
    
    // 3. 로그인 API 호출
    const loginResponse = await api.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.data.session.access_token).toBeTruthy();
  });
});
```

### IT-002: 레스토랑 관리 API 통합 테스트

#### 테스트 시나리오
```javascript
describe('Restaurant Management Integration', () => {
  test('레스토랑 생성 → 조회 → 수정 → 삭제 CRUD 테스트', async () => {
    // 1. 관리자 인증
    const authToken = await getAdminToken();
    
    // 2. 레스토랑 생성
    const createResponse = await api.post('/api/admin/restaurants', {
      name: '테스트 레스토랑',
      description: '테스트용 레스토랑입니다',
      category_id: 'category-uuid',
      address: '서울시 강남구 테헤란로 123',
      phone: '02-123-4567'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(createResponse.status).toBe(201);
    const restaurantId = createResponse.data.data.restaurant.id;
    
    // 3. 레스토랑 조회 (슬러그 생성 확인)
    const getResponse = await api.get(`/api/restaurants/${createResponse.data.data.restaurant.slug}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.data.data.restaurant.name).toBe('테스트 레스토랑');
    
    // 4. 레스토랑 수정
    const updateResponse = await api.put(`/api/admin/restaurants/${restaurantId}`, {
      name: '수정된 레스토랑',
      description: '수정된 설명입니다'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(updateResponse.status).toBe(200);
    
    // 5. 레스토랑 삭제
    const deleteResponse = await api.delete(`/api/admin/restaurants/${restaurantId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    expect(deleteResponse.status).toBe(200);
  });
});
```

### IT-003: 예약 시스템 통합 테스트

#### 테스트 시나리오
```javascript
describe('Reservation System Integration', () => {
  test('예약 생성 → 이메일 발송 → 상태 업데이트 플로우', async () => {
    // 1. 사용자 로그인
    const userToken = await getUserToken('user@example.com');
    
    // 2. 예약 생성
    const reservationData = {
      restaurant_id: 'restaurant-uuid',
      date: '2025년 9월 7일 (토요일)',
      time: '18:30',
      party_size: 4,
      customer_name: '홍길동',
      customer_email: 'user@example.com',
      customer_phone: '010-1234-5678',
      special_request: '창가 자리 부탁드립니다'
    };
    
    const createResponse = await api.post('/api/reservations', reservationData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    expect(createResponse.status).toBe(201);
    const reservationId = createResponse.data.data.reservation.id;
    
    // 3. 데이터베이스에서 예약 확인
    const reservation = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();
      
    expect(reservation.data.status).toBe('confirmed');
    
    // 4. 이메일 발송 확인 (Mock 또는 실제 확인)
    const emailSent = await checkEmailSent(reservationData.customer_email);
    expect(emailSent).toBe(true);
    
    // 5. 예약 취소 테스트
    const cancelResponse = await api.delete(`/api/reservations/${reservationId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    expect(cancelResponse.status).toBe(200);
    
    // 6. 취소 상태 확인
    const cancelledReservation = await supabase
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .single();
      
    expect(cancelledReservation.data.status).toBe('cancelled');
  });
});
```

## Phase 2: 프론트엔드 통합 테스트

### IT-004: React 컴포넌트 통합 테스트

#### 테스트 도구
- **Testing Library**: @testing-library/react
- **Jest**: 테스트 러너
- **MSW**: API 모킹

#### 테스트 시나리오
```javascript
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';

describe('LoginModal Integration', () => {
  test('로그인 성공 시 사용자 정보 업데이트', async () => {
    // MSW로 API 모킹
    server.use(
      rest.post('/api/auth/login', (req, res, ctx) => {
        return res(ctx.json({
          success: true,
          user: { id: '1', name: '홍길동', email: 'test@example.com' },
          session: { access_token: 'mock-token' }
        }));
      })
    );
    
    const mockOnLogin = jest.fn();
    
    render(
      <AuthProvider>
        <LoginModal isOpen={true} onClose={() => {}} onLogin={mockOnLogin} />
      </AuthProvider>
    );
    
    // 입력 필드 채우기
    fireEvent.change(screen.getByPlaceholderText('이메일'), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByPlaceholderText('비밀번호'), {
      target: { value: 'password123' }
    });
    
    // 로그인 버튼 클릭
    fireEvent.click(screen.getByText('로그인'));
    
    // 로그인 성공 확인
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });
});
```

### IT-005: 예약 플로우 통합 테스트

#### 테스트 시나리오
```javascript
describe('Reservation Flow Integration', () => {
  test('레스토랑 선택 → 예약 페이지 → 예약 완료 전체 플로우', async () => {
    // 1. 레스토랑 목록 렌더링
    render(<RestaurantList />);
    
    await waitFor(() => {
      expect(screen.getByText('맛있는 한식당')).toBeInTheDocument();
    });
    
    // 2. 레스토랑 클릭
    fireEvent.click(screen.getByText('맛있는 한식당'));
    
    // 3. 레스토랑 상세 페이지 확인
    await waitFor(() => {
      expect(screen.getByText('예약하기')).toBeInTheDocument();
    });
    
    // 4. 예약 버튼 클릭
    fireEvent.click(screen.getByText('예약하기'));
    
    // 5. 예약 페이지 이동 확인
    await waitFor(() => {
      expect(window.location.pathname).toBe('/reservation');
    });
  });
});
```

## Phase 3: 엔드투엔드 시나리오 테스트

### IT-006: 사용자 전체 시나리오 테스트

#### 테스트 도구
- **Playwright** 또는 **Cypress**
- **실제 브라우저** 환경

#### 테스트 시나리오
```javascript
// Playwright 예시
test('사용자 회원가입부터 예약 완료까지 전체 플로우', async ({ page }) => {
  // 1. 메인 페이지 접속
  await page.goto('https://restaurant-booking-portal.vercel.app');
  
  // 2. 회원가입
  await page.click('text=로그인');
  await page.click('text=회원가입');
  await page.fill('input[type="email"]', 'e2e-test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.fill('input[placeholder="이름"]', 'E2E 테스터');
  await page.fill('input[placeholder="전화번호"]', '010-1234-5678');
  await page.click('text=가입하기');
  
  // 3. 회원가입 성공 확인
  await expect(page.locator('text=E2E 테스터')).toBeVisible();
  
  // 4. 레스토랑 검색
  await page.fill('input[placeholder="음식이나 레스토랑을 검색하세요"]', '한식');
  await page.click('text=검색');
  
  // 5. 검색 결과 확인
  await expect(page).toHaveURL(/restaurants\?search=한식/);
  
  // 6. 레스토랑 선택
  await page.click('.restaurant-card').first();
  
  // 7. 예약하기 버튼 클릭
  await page.click('text=예약하기');
  
  // 8. 예약 정보 입력
  await page.selectOption('select', '2025-09-07'); // 날짜 선택
  await page.click('button:has-text("19:00")'); // 시간 선택
  await page.click('button:has-text("+")'); // 인원수 증가
  await page.fill('textarea', '창가 자리로 부탁드립니다');
  
  // 9. 예약 확정
  await page.click('text=예약 확정');
  
  // 10. 예약 완료 확인
  await expect(page.locator('text=예약이 완료되었습니다')).toBeVisible();
  await expect(page).toHaveURL('/dashboard');
});
```

### IT-007: 관리자 전체 시나리오 테스트

#### 테스트 시나리오
```javascript
test('관리자 로그인부터 레스토랑 등록까지', async ({ page }) => {
  // 1. 관리자 페이지 접속
  await page.goto('https://restaurant-booking-portal.vercel.app/admin');
  
  // 2. 관리자 로그인
  await page.fill('input[type="email"]', 'admin@restaurant-portal.com');
  await page.fill('input[type="password"]', 'admin_password');
  await page.click('text=로그인');
  
  // 3. 관리자 대시보드 확인
  await expect(page.locator('text=레스토랑 관리')).toBeVisible();
  
  // 4. 새 레스토랑 등록
  await page.click('text=레스토랑 관리');
  await page.click('text=새 레스토랑 등록');
  
  await page.fill('input[placeholder="레스토랑 이름"]', 'E2E 테스트 레스토랑');
  await page.fill('textarea[placeholder="설명"]', 'E2E 테스트용 레스토랑입니다');
  await page.selectOption('select[name="category"]', '한식');
  await page.fill('input[placeholder="주소"]', '서울시 강남구 테헤란로 123');
  await page.fill('input[placeholder="전화번호"]', '02-123-4567');
  
  // 5. 저장 및 확인
  await page.click('text=저장');
  await expect(page.locator('text=레스토랑이 등록되었습니다')).toBeVisible();
  
  // 6. 목록에서 등록된 레스토랑 확인
  await expect(page.locator('text=E2E 테스트 레스토랑')).toBeVisible();
});
```

## Phase 4: 성능 및 부하 테스트

### IT-008: API 성능 테스트

#### 테스트 도구
- **Artillery.js** 또는 **k6**
- **Apache Bench (ab)**

#### 테스트 시나리오
```yaml
# artillery-config.yml
config:
  target: 'https://restaurant-booking-portal.vercel.app/api'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Load test"
    - duration: 60
      arrivalRate: 100
      name: "Spike test"

scenarios:
  - name: "Restaurant List API"
    weight: 40
    flow:
      - get:
          url: "/restaurants"
      - think: 2
  
  - name: "Restaurant Detail API"
    weight: 30
    flow:
      - get:
          url: "/restaurants/delicious-korean"
      - think: 3
  
  - name: "User Reservation"
    weight: 30
    flow:
      - post:
          url: "/reservations"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            restaurant_id: "{{ restaurantId }}"
            date: "2025년 9월 7일 (토요일)"
            time: "18:30"
            party_size: 2
```

#### 성능 기준
```
✅ 평균 응답 시간: < 500ms
✅ 95th 백분위수: < 1000ms  
✅ 에러율: < 1%
✅ 처리량: > 100 RPS
```

### IT-009: 데이터베이스 성능 테스트

#### 테스트 시나리오
```sql
-- 복잡한 조회 쿼리 성능 테스트
EXPLAIN ANALYZE
SELECT 
  r.*,
  c.name as category_name,
  c.icon as category_icon,
  AVG(rv.rating) as avg_rating,
  COUNT(rv.id) as review_count,
  COUNT(res.id) as reservation_count
FROM restaurants r
LEFT JOIN categories c ON r.category_id = c.id
LEFT JOIN reviews rv ON r.id = rv.restaurant_id
LEFT JOIN reservations res ON r.id = res.restaurant_id
WHERE r.address ILIKE '%강남%'
  AND r.rating >= 4.0
GROUP BY r.id, c.name, c.icon
ORDER BY avg_rating DESC, review_count DESC
LIMIT 20;
```

#### 성능 기준
```
✅ 단순 SELECT: < 10ms
✅ 복잡 JOIN: < 100ms
✅ INSERT/UPDATE: < 50ms
✅ 인덱스 활용률: > 90%
```

---

## 🔍 테스트 환경 구성

### 테스트 환경 세팅

#### 개발 환경
```bash
# 로컬 테스트 환경 구성
npm install
npm run dev

# 테스트 데이터베이스 설정
npm run db:test:setup
npm run db:test:seed
```

#### CI/CD 환경
```yaml
# .github/workflows/integration-test.yml
name: Integration Tests

on: [push, pull_request]

jobs:
  integration-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
          
      - name: Run E2E tests
        run: npm run test:e2e
```

### 테스트 데이터 관리

#### 테스트 픽스처
```javascript
// tests/fixtures/restaurants.js
export const testRestaurants = [
  {
    id: 'test-restaurant-1',
    name: '테스트 한식당',
    slug: 'test-korean-restaurant',
    category_id: 'korean-category',
    address: '서울시 강남구 테헤란로 123',
    phone: '02-123-4567',
    rating: 4.5,
    total_reviews: 10
  },
  // ... 더 많은 테스트 데이터
];

export const testUsers = [
  {
    id: 'test-user-1',
    email: 'test@example.com',
    name: '테스트 사용자',
    phone: '010-1234-5678'
  }
  // ... 더 많은 테스트 사용자
];
```

#### 테스트 데이터 초기화
```javascript
// tests/helpers/setup.js
export async function setupTestData() {
  // 테스트용 카테고리 생성
  await supabase.from('categories').insert([
    { id: 'korean-category', name: '한식', icon: '🍖' },
    { id: 'japanese-category', name: '일식', icon: '🍣' }
  ]);
  
  // 테스트용 레스토랑 생성
  await supabase.from('restaurants').insert(testRestaurants);
  
  // 테스트용 사용자 생성
  await supabase.from('users').insert(testUsers);
}

export async function cleanupTestData() {
  // 생성된 테스트 데이터 정리
  await supabase.from('reservations').delete().neq('id', '');
  await supabase.from('reviews').delete().neq('id', '');
  await supabase.from('restaurants').delete().neq('id', '');
  await supabase.from('users').delete().neq('id', '');
  await supabase.from('categories').delete().neq('id', '');
}
```

---

## 📊 테스트 결과 및 리포팅

### 테스트 결과 수집

#### Jest 테스트 리포터
```javascript
// jest.config.js
module.exports = {
  // ... 기타 설정
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: './test-results',
      outputName: 'integration-test-results.xml'
    }],
    ['jest-html-reporter', {
      pageTitle: 'Integration Test Report',
      outputPath: './test-results/integration-report.html'
    }]
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
};
```

#### 성능 테스트 결과
```javascript
// artillery-results-processor.js
const fs = require('fs');

function processArtilleryResults(resultsFile) {
  const results = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  
  const summary = {
    scenarios: results.aggregate.scenariosCreated,
    requests: results.aggregate.requestsCompleted,
    errors: results.aggregate.errors,
    averageResponseTime: results.aggregate.latency.mean,
    p95ResponseTime: results.aggregate.latency.p95,
    rps: results.aggregate.rps.mean
  };
  
  console.log('Performance Test Summary:');
  console.log(JSON.stringify(summary, null, 2));
  
  // 기준치 검증
  if (summary.averageResponseTime > 500) {
    throw new Error(`평균 응답 시간 기준 초과: ${summary.averageResponseTime}ms`);
  }
  
  if (summary.errors > summary.requests * 0.01) {
    throw new Error(`에러율 기준 초과: ${(summary.errors/summary.requests)*100}%`);
  }
}
```

### 테스트 대시보드

#### GitHub Actions 연동
```yaml
- name: Publish Test Results
  uses: dorny/test-reporter@v1
  if: always()
  with:
    name: Integration Tests
    path: 'test-results/*.xml'
    reporter: jest-junit

- name: Upload Coverage Reports  
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
    fail_ci_if_error: true
```

---

## 🎯 테스트 완료 기준

### 통과 기준
1. **기능 테스트**: 모든 핵심 기능 정상 동작
2. **API 테스트**: 모든 엔드포인트 응답 정상
3. **성능 테스트**: 정의된 성능 기준 충족
4. **보안 테스트**: 주요 보안 취약점 없음
5. **호환성 테스트**: 지원 브라우저에서 정상 동작

### 결함 허용 기준
- **Critical**: 0건
- **High**: 2건 이하
- **Medium**: 5건 이하
- **Low**: 제한 없음

### 성능 기준
- **페이지 로딩**: 3초 이내
- **API 응답**: 500ms 이내
- **동시 사용자**: 100명 지원
- **데이터베이스**: 1000 TPS 이상

---

## 📝 테스트 완료 보고서 템플릿

```markdown
# 통합테스트 완료 보고서

## 테스트 개요
- **테스트 기간**: 2025.09.07 ~ 2025.09.10
- **테스트 범위**: 전체 시스템 통합
- **참여 인원**: 3명 (개발자 2명, QA 1명)

## 테스트 결과 요약
- **전체 테스트 케이스**: 50개
- **통과**: 48개 (96%)
- **실패**: 2개 (4%)
- **건너뜀**: 0개

## 발견된 결함
### Critical (0건)
### High (1건)
- **결함 ID**: BUG-001
- **제목**: 예약 확정 시 이메일 발송 실패
- **상태**: 수정 완료

### Medium (3건)
- **결함 ID**: BUG-002
- **제목**: 모바일에서 레스토랑 카드 레이아웃 깨짐
- **상태**: 수정 중

## 성능 테스트 결과
- **평균 응답 시간**: 450ms ✅
- **95th 백분위수**: 800ms ✅
- **에러율**: 0.5% ✅
- **처리량**: 120 RPS ✅

## 권장사항
1. 이메일 서비스 모니터링 강화
2. 모바일 테스트 자동화 도입
3. 성능 모니터링 대시보드 구축

## 결론
전체적으로 시스템이 안정적이며 프로덕션 배포 준비 완료
```

---

*최종 업데이트: 2025년 9월 6일*  
*버전: v1.0*