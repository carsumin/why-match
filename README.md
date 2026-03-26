# WhyMatch — 이유 있는 매칭

> 해커톤 팀 매칭, 이제는 점수와 이유로 결정하세요.

태그 기반 적합도 알고리즘으로 딱 맞는 해커톤 팀원을 찾아주는 서비스입니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 매칭 점수 | 태그 일치 40% + 역할 필요도 40% + 활동 시간 20% |
| 이유 제시 | "React 기술이 일치합니다" 등 한 줄 매칭 이유 |
| 스와이프 탐색 | 팀 카드를 스와이프하며 직관적으로 탐색 |
| 팀 빌딩 시뮬레이터 | 합류 전/후 팀 점수 변화 미리 보기 |
| 해커톤 카운트다운 | 마감 임박 해커톤 실시간 D-day 배너 |

## 페이지 구조

```
/                   메인 (카운트다운 배너, CTA)
/hackathons         해커톤 목록
/hackathons/[slug]  해커톤 상세 (7개 탭)
/camp               팀원 모집 스와이프
/camp/simulate      팀 빌딩 시뮬레이터
/messages           메시지함
/rankings           랭킹 보드
/profile/[id]       유저 프로필
/showcase           수상작 갤러리
```

## 기술 스택

- **Framework** Next.js 14 (App Router)
- **Language** TypeScript
- **Styling** Tailwind CSS
- **Deploy** Vercel

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

`http://localhost:3000` 에서 확인하세요.

## 브랜치 전략

| 브랜치 | 용도 |
|--------|------|
| `main` | 배포용 (Vercel 연결) |
| `dev` | 개발 작업 |

## 매칭 알고리즘

```
적합도 = (태그 일치 × 40%) + (역할 필요도 × 40%) + (활동 시간 × 20%)

80% 이상 → High Match
60~79%   → Medium Match
60% 미만 → Low Match
```
