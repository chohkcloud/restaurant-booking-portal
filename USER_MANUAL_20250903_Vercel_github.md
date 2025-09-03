# GitHub - Vercel 연동 배포 완전 가이드
## 초보자를 위한 단계별 매뉴얼

**작성일**: 2025-09-03  
**대상**: 개발 초보자 ~ 중급자  
**소요 시간**: 약 15-20분  
**전제 조건**: Git 기본 사용법 숙지

---

## 📋 목차

1. [개요](#개요)
2. [사전 준비사항](#사전-준비사항)
3. [GitHub 저장소 생성](#github-저장소-생성)
4. [로컬 프로젝트와 GitHub 연결](#로컬-프로젝트와-github-연결)
5. [Vercel 계정 생성 및 설정](#vercel-계정-생성-및-설정)
6. [Vercel과 GitHub 연동](#vercel과-github-연동)
7. [자동 배포 설정](#자동-배포-설정)
8. [커스텀 도메인 설정](#커스텀-도메인-설정)
9. [문제 해결 가이드](#문제-해결-가이드)
10. [고급 설정](#고급-설정)

---

## 🎯 개요

### Vercel이란?
- **Next.js를 만든 회사**에서 제공하는 클라우드 배포 플랫폼
- **무료 플랜**으로도 충분히 사용 가능
- **자동 배포**, **HTTPS**, **글로벌 CDN** 등 제공
- GitHub과 완벽하게 연동되어 코드 푸시만으로 자동 배포

### 연동의 장점
✅ **자동 배포**: GitHub에 푸시하면 자동으로 웹사이트 업데이트  
✅ **무료 HTTPS**: SSL 인증서 자동 설정  
✅ **글로벌 CDN**: 전 세계 어디서든 빠른 로딩  
✅ **프리뷰 URL**: Pull Request마다 미리보기 URL 생성  
✅ **Analytics**: 방문자 통계 제공  
✅ **커스텀 도메인**: 무료로 자신만의 도메인 연결

---

## 🛠️ 사전 준비사항

### 필수 준비물
1. **GitHub 계정** (https://github.com)
2. **로컬 개발 환경** (Git 설치됨)
3. **완성된 Next.js 프로젝트** (정상 빌드 확인)

### 체크리스트
- [ ] GitHub 계정 생성 완료
- [ ] Git이 컴퓨터에 설치되어 있음
- [ ] 프로젝트가 로컬에서 정상 실행됨 (`npm run dev`)
- [ ] 프로젝트가 정상 빌드됨 (`npm run build`)

---

## 📁 GitHub 저장소 생성

### Step 1: GitHub 웹사이트 접속
1. **https://github.com** 접속
2. 오른쪽 상단 **"Sign in"** 클릭하여 로그인

### Step 2: 새 저장소 생성
1. 로그인 후 **"+"** 버튼 클릭 → **"New repository"** 선택
   
   또는 직접 **https://github.com/new** 접속

2. **저장소 정보 입력**:
   ```
   Repository name*: restaurant-booking-portal
   Description: Restaurant booking portal with Next.js
   
   ☑️ Public (권장 - 무료 기능 모두 사용 가능)
   ☐ Add a README file (체크하지 않음!)
   ☐ Add .gitignore (체크하지 않음!)
   ☐ Choose a license (None으로 두기)
   ```

3. **"Create repository"** 클릭

### Step 3: 생성된 저장소 URL 확인
생성 완료 후 표시되는 URL을 메모해두세요:
```
https://github.com/사용자명/restaurant-booking-portal.git
```

**중요**: 이 URL은 다음 단계에서 사용됩니다!

---

## 🔗 로컬 프로젝트와 GitHub 연결

### Step 1: 터미널/명령프롬프트 열기
프로젝트 루트 디렉토리에서 터미널을 열어주세요.
```bash
# Windows
cd F:\restaurant-booking

# Mac/Linux  
cd /path/to/restaurant-booking
```

### Step 2: Git 초기화 확인
```bash
# 이미 Git이 초기화되어 있는지 확인
git status

# 만약 "not a git repository" 오류가 나면
git init
```

### Step 3: 원격 저장소 연결
```bash
# GitHub 저장소를 원격 저장소로 추가
git remote add origin https://github.com/사용자명/restaurant-booking-portal.git

# 원격 저장소 연결 확인
git remote -v
```

**예시 출력**:
```
origin  https://github.com/chohkcloud/restaurant-booking-portal.git (fetch)
origin  https://github.com/chohkcloud/restaurant-booking-portal.git (push)
```

### Step 4: 파일 추가 및 커밋
```bash
# 모든 파일 스테이징
git add .

# 커밋 생성
git commit -m "Initial commit - Restaurant booking portal

- Next.js 15 project setup
- Restaurant booking interface with orange/red theme
- Mobile responsive design
- TypeScript and Tailwind CSS integration

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Step 5: GitHub에 푸시
```bash
# 메인 브랜치로 푸시
git push -u origin master

# 또는 main 브랜치를 사용하는 경우
git push -u origin main
```

**성공 메시지 예시**:
```
Enumerating objects: 142, done.
Counting objects: 100% (142/142), done.
Delta compression using up to 8 threads
Compressing objects: 100% (128/128), done.
Writing objects: 100% (142/142), 245.67 KiB | 8.16 MiB/s, done.
Total 142 (delta 12), reused 0 (delta 0), pack-reused 0
To https://github.com/chohkcloud/restaurant-booking-portal.git
 * [new branch]      master -> master
Branch 'master' set up to track remote branch 'master' from 'origin'.
```

### Step 6: GitHub에서 확인
1. **https://github.com/사용자명/restaurant-booking-portal** 접속
2. 모든 파일이 업로드되었는지 확인
3. `components/`, `app/`, `lib/` 등 폴더가 보이는지 확인

---

## 🌐 Vercel 계정 생성 및 설정

### Step 1: Vercel 회원가입
1. **https://vercel.com** 접속
2. **"Sign Up"** 클릭
3. **"Continue with GitHub"** 선택 (권장)
4. GitHub 계정으로 인증 완료

### Step 2: 기본 설정 확인
1. **Dashboard**가 표시되면 가입 완료
2. 왼쪽 사이드바에서 개인 계정명 확인
3. **"New Project"** 버튼이 보이는지 확인

---

## 🚀 Vercel과 GitHub 연동

### Step 1: 새 프로젝트 생성
1. Vercel Dashboard에서 **"New Project"** 클릭
2. **"Import Git Repository"** 섹션에서 **"Continue with GitHub"** 클릭

### Step 2: GitHub 저장소 선택
1. 저장소 목록에서 **"restaurant-booking-portal"** 찾기
2. 해당 저장소 옆의 **"Import"** 버튼 클릭

**저장소가 보이지 않는 경우**:
- **"Adjust GitHub App Permissions"** 클릭
- GitHub에서 Vercel 앱 권한 설정
- 해당 저장소에 접근 권한 부여

### Step 3: 프로젝트 설정
```
Configure Project
┌─────────────────────────────────────────────────────────┐
│ Project Name: restaurant-booking-portal                 │
│ Framework Preset: Next.js (자동 감지됨)                 │  
│ Root Directory: ./                                      │
│ Build and Output Settings:                              │
│   Build Command: npm run build (자동)                  │
│   Output Directory: .next (자동)                       │
│   Install Command: npm install (자동)                  │
└─────────────────────────────────────────────────────────┘
```

**설정 권장사항**:
- **Project Name**: 기본값 그대로 사용
- **Framework Preset**: Next.js 자동 선택됨
- **Build Settings**: 기본값 그대로 사용
- **Environment Variables**: 일단 비워두고 나중에 설정

### Step 4: 배포 시작
1. **"Deploy"** 버튼 클릭
2. 배포 진행 상황 실시간 모니터링

**배포 과정 단계**:
```
🔄 Building...
├── Installing dependencies...
├── Building application...  
├── Generating static pages...
└── Finalizing...

✅ Deployment completed successfully!
```

### Step 5: 배포 완료 확인
배포 완료 후 다음 3가지 옵션이 나타납니다:

1. **Visit** - 배포된 사이트 방문
2. **Continue to Dashboard** - 프로젝트 관리 대시보드로 이동
3. **View Source** - GitHub 소스코드 확인

**"Continue to Dashboard"**를 클릭하세요.

---

## ⚡ 자동 배포 설정

### 자동 배포란?
GitHub에 새 코드를 푸시할 때마다 Vercel이 자동으로 웹사이트를 업데이트하는 기능

### 설정 확인
1. **Project Dashboard** → **Settings** → **Git** 탭
2. **Production Branch**: `master` (또는 `main`)
3. **Auto-deploy**: ✅ 활성화됨 (기본값)

### 자동 배포 테스트
1. **로컬에서 코드 수정**:
   ```tsx
   // app/page.tsx 수정 예시
   <h1>🍽️ 맛집 예약 포털 - v2.0</h1>
   ```

2. **Git으로 변경사항 푸시**:
   ```bash
   git add .
   git commit -m "Update page title to v2.0"
   git push origin master
   ```

3. **Vercel에서 자동 배포 확인**:
   - Dashboard → Deployments 탭
   - 새로운 배포가 자동으로 시작됨
   - 약 1-3분 후 배포 완료

### 배포 상태 모니터링
- **Building**: 빌드 진행 중
- **Ready**: 배포 완료, 라이브 상태
- **Error**: 오류 발생, 로그 확인 필요

---

## 🔗 URL 및 도메인 관리

### 기본 제공 URL
Vercel은 자동으로 다음과 같은 URL을 생성합니다:
```
https://프로젝트명.vercel.app
https://프로젝트명-사용자명.vercel.app
```

**예시**:
- https://restaurant-booking-portal.vercel.app
- https://restaurant-booking-portal-chohkcloud.vercel.app

### URL 커스터마이징
1. **Dashboard** → **Settings** → **Domains**
2. **Edit** 버튼으로 기본 도메인 수정 가능
3. **Add Custom Domain**으로 자신만의 도메인 연결

---

## 🌟 커스텀 도메인 설정

### 무료 도메인 획득
**무료 도메인 제공 서비스**:
- **Freenom** (freenom.com) - .tk, .ml, .ga, .cf
- **Dot.tk** (dot.tk) - .tk 도메인
- **GitHub Student Pack** - 학생이면 .me 도메인 무료

### 유료 도메인 구입
**추천 도메인 등록 업체**:
- **Google Domains** (domains.google) - 편리함
- **Namecheap** (namecheap.com) - 저렴함
- **Cloudflare** (cloudflare.com) - DNS 포함

### Vercel에 커스텀 도메인 연결

#### Step 1: 도메인 추가
1. **Vercel Dashboard** → **Settings** → **Domains**
2. **Add Domain** 버튼 클릭
3. 도메인 입력 (예: `mybookingsite.com`)
4. **Add** 클릭

#### Step 2: DNS 설정
Vercel이 제공하는 DNS 설정 값을 도메인 등록 업체에서 설정:

```dns
Type: A
Name: @ (또는 root)
Value: 76.76.19.19

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

#### Step 3: SSL 인증서 자동 설정
- Vercel이 자동으로 SSL 인증서 발급
- HTTPS 자동 적용 (무료)
- 보통 24시간 이내 활성화

### 서브도메인 설정
```dns
Type: CNAME
Name: booking (또는 원하는 서브도메인명)
Value: cname.vercel-dns.com
```
결과: https://booking.yourdomain.com

---

## 🔧 환경 변수 설정

### 환경 변수란?
- API 키, 데이터베이스 URL 등 민감한 정보
- `.env.local` 파일에 저장
- Vercel에서 별도 설정 필요

### Vercel에서 환경 변수 설정
1. **Dashboard** → **Settings** → **Environment Variables**
2. **Add New** 클릭
3. **Key-Value 쌍 입력**:
   ```
   Key: NEXT_PUBLIC_SUPABASE_URL
   Value: https://your-project.supabase.co
   Environments: ✅ Production ✅ Preview ✅ Development
   ```

### 일반적인 환경 변수들
```env
# Database
DATABASE_URL=your_database_connection_string
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Keys  
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
STRIPE_SECRET_KEY=sk_test_...

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
```

### 환경 변수 적용
환경 변수 설정 후 **새로운 배포**가 필요합니다:
```bash
git commit -m "Update environment variables" --allow-empty
git push origin master
```

---

## 📊 Analytics 및 모니터링

### Vercel Analytics 활성화
1. **Dashboard** → **Analytics** 탭
2. **Enable Analytics** 클릭
3. 실시간 방문자 통계 확인 가능

### 제공되는 데이터
- **Page Views**: 페이지 조회수
- **Unique Visitors**: 순 방문자 수
- **Top Pages**: 인기 페이지
- **Referrers**: 유입 경로
- **Devices**: 디바이스 분석

### Speed Insights
1. **Dashboard** → **Speed Insights** 탭
2. **Enable Speed Insights** 클릭
3. **Core Web Vitals** 성능 지표 확인

---

## 🛠️ 문제 해결 가이드

### 일반적인 오류와 해결책

#### 1. 빌드 실패 (Build Failed)
**증상**: Deployment 탭에서 빌드 실패 표시

**원인 & 해결책**:
```bash
# ESLint 오류
- 문제: TypeScript 타입 오류, unused 변수 등
- 해결: 로컬에서 `npm run lint` 실행 후 오류 수정

# 환경 변수 누락
- 문제: 필수 환경 변수가 설정되지 않음
- 해결: Vercel Dashboard에서 환경 변수 설정

# 종속성 오류  
- 문제: package.json의 dependency 버전 충돌
- 해결: npm install 재실행 후 package-lock.json 업데이트
```

#### 2. GitHub 연동 실패
**증상**: 저장소 목록에 프로젝트가 보이지 않음

**해결책**:
1. **Vercel GitHub App 권한 확인**:
   - GitHub → Settings → Applications → Authorized OAuth Apps
   - Vercel 찾아서 권한 확인/수정

2. **저장소 접근 권한 부여**:
   - Vercel Dashboard → Account Settings → Git Integration
   - "Adjust GitHub App Permissions" 클릭
   - 해당 저장소 체크

#### 3. 도메인 연결 실패
**증상**: 커스텀 도메인 접속 안됨

**해결책**:
1. **DNS 전파 시간 대기** (24-48시간)
2. **DNS 설정 재확인**:
   ```bash
   # DNS 확인 명령어
   nslookup your-domain.com
   dig your-domain.com
   ```
3. **Cloudflare 사용시**: Proxy 비활성화 (회색 구름)

#### 4. 환경 변수 적용 안됨
**증상**: 환경 변수 값이 undefined로 출력

**해결책**:
1. **환경 변수명 확인**: `NEXT_PUBLIC_` 접두사 필요 (클라이언트 사이드)
2. **Environments 설정**: Production, Preview, Development 모두 체크
3. **재배포 필요**: 환경 변수 변경 후 새로운 배포 실행

### 디버깅 도구

#### 1. Vercel 배포 로그 확인
1. **Dashboard** → **Deployments** → 실패한 배포 클릭
2. **Function Logs** 탭에서 상세 오류 확인
3. **Build Logs**에서 빌드 과정 확인

#### 2. 로컬 환경 재현
```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build
npm start

# Vercel CLI로 로컬 테스트
npx vercel dev
```

#### 3. 브라우저 개발자 도구
- **Console**: JavaScript 오류 확인
- **Network**: API 호출 오류 확인  
- **Application**: 환경 변수 값 확인

---

## 🚀 고급 설정

### Preview Deployments
GitHub Pull Request 생성시 자동으로 미리보기 URL 생성

**설정 방법**:
1. **Dashboard** → **Settings** → **Git**
2. **Preview Deployments**: ✅ 활성화

**사용법**:
1. GitHub에서 새 브랜치 생성
2. 코드 수정 후 Pull Request 생성  
3. Vercel이 자동으로 미리보기 URL 생성
4. PR 코멘트에 미리보기 링크 표시

### Edge Functions
서버리스 함수를 Edge 네트워크에서 실행

**예시 - API Route**:
```typescript
// pages/api/hello.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json({ message: 'Hello from Vercel Edge!' })
}
```

### Middleware
Request/Response를 가로채서 처리

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 인증 체크, 리다이렉트 등
  const url = request.nextUrl
  
  if (url.pathname === '/admin') {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*']
}
```

### Serverless Functions 최적화
```json
// vercel.json
{
  "functions": {
    "pages/api/**/*.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  },
  "regions": ["icn1", "nrt1"]
}
```

---

## 📈 성능 최적화

### Image Optimization
```tsx
// Next.js Image 컴포넌트 사용
import Image from 'next/image'

<Image 
  src="/restaurant-interior.jpg"
  alt="Restaurant Interior"
  width={800}
  height={600}
  priority={true}  // LCP 이미지의 경우
  placeholder="blur"  // 로딩 중 블러 효과
/>
```

### Dynamic Imports
```tsx
// 컴포넌트 지연 로딩
import dynamic from 'next/dynamic'

const DynamicModal = dynamic(() => import('../components/Modal'), {
  ssr: false,  // 클라이언트 사이드에서만 로드
  loading: () => <div>Loading...</div>
})
```

### Bundle Analysis
```bash
# 번들 크기 분석
npm install --save-dev @next/bundle-analyzer

# next.config.js에 설정 추가
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // Next.js 설정
})

# 분석 실행
ANALYZE=true npm run build
```

---

## 🔐 보안 설정

### Security Headers
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',  
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

### Environment Security
```env
# ❌ 잘못된 예 (GitHub에 노출됨)
DATABASE_PASSWORD=mypassword123

# ✅ 올바른 예 (Vercel에서만 설정)
# .env.local은 .gitignore에 포함
# Vercel Dashboard에서 환경 변수로 설정
```

---

## 📚 추가 자료 및 참고 링크

### 공식 문서
- **Vercel 공식 문서**: https://vercel.com/docs
- **Next.js 공식 가이드**: https://nextjs.org/docs/deployment
- **GitHub Actions와 Vercel**: https://vercel.com/guides/how-can-i-use-github-actions-with-vercel

### 커뮤니티 자료  
- **Vercel Examples**: https://github.com/vercel/next.js/tree/canary/examples
- **Next.js 한국 커뮤니티**: https://nextjs.kr
- **Stack Overflow**: `vercel` 태그 검색

### 도구 및 확장
- **Vercel CLI**: `npm install -g vercel`
- **GitHub CLI**: `gh` 명령어로 저장소 관리
- **VSCode 확장**: Vercel for VSCode

---

## ✅ 최종 체크리스트

### 기본 설정 완료
- [ ] GitHub 저장소 생성 및 코드 푸시
- [ ] Vercel 계정 생성 및 GitHub 연동
- [ ] 자동 배포 설정 및 테스트
- [ ] 기본 도메인 URL 확인 (.vercel.app)

### 고급 설정 (선택사항)
- [ ] 커스텀 도메인 연결
- [ ] 환경 변수 설정
- [ ] Analytics 활성화
- [ ] Speed Insights 설정
- [ ] Preview Deployments 활성화

### 보안 및 성능 (권장)
- [ ] Security Headers 설정
- [ ] Image Optimization 적용
- [ ] Bundle Size 최적화
- [ ] Error Monitoring 설정

---

## 🆘 긴급 상황 대응

### 사이트 다운시 응급 대응
1. **Vercel Status 페이지 확인**: https://vercel-status.com
2. **이전 배포로 롤백**:
   - Dashboard → Deployments → 이전 성공 배포 선택 → "Promote to Production"
3. **DNS 캐시 클리어**: `ipconfig /flushdns` (Windows) 또는 `sudo dscacheutil -flushcache` (Mac)

### 지원 받기
- **Vercel Support**: https://vercel.com/help
- **GitHub Support**: https://support.github.com
- **Stack Overflow**: `vercel` + `next.js` 태그로 질문

---

## 💡 꿀팁 모음

### 개발 효율성 향상
```bash
# Vercel CLI로 빠른 배포
npx vercel --prod

# 특정 브랜치만 배포 설정
# Dashboard → Settings → Git → Production Branch

# 로컬에서 Vercel 환경 변수 사용
npx vercel env pull .env.local
```

### 비용 최적화
- **무료 플랜 한계**: 월 100GB 대역폭, 100개 배포
- **Function 실행 시간**: 10초 제한 (무료)
- **이미지 최적화**: 월 1,000개 변환 (무료)

### SEO 최적화
```tsx
// app/layout.tsx 또는 pages/_app.tsx
export const metadata = {
  title: 'Restaurant Booking Portal',
  description: 'Best restaurant booking experience',
  keywords: 'restaurant, booking, reservation',
  openGraph: {
    images: ['/og-image.jpg']
  }
}
```

---

**최종 업데이트**: 2025-09-03  
**문서 버전**: 1.0.0  
**작성자**: Claude Code AI Assistant  

**이 문서가 도움이 되셨나요?**  
GitHub Issues나 Pull Request로 개선사항을 제안해주세요! 🚀