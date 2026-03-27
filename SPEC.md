# SPEC.md — WhyMatch 기능 명세서

---

## 공통 (모든 페이지)

- 상단 내비게이션 바: `/` · `/hackathons` · `/camp` · `/rankings` — 이 4개 경로만 표시
- 로딩 상태 · 데이터 없음 상태 · 에러 상태 3종 UI 반드시 제공
- localStorage 데이터 키: `hackathons` · `teams` · `submissions` · `leaderboards`

---

## 1. 메인 페이지 (`/`)

### 필수 UI 요소
- 큰 카드 버튼 3개:
  - 해커톤 보러가기 → `/hackathons`
  - 팀 찾기 → `/camp`
  - 랭킹 보기 → `/rankings`

### 확장 UI 요소
- 마감 임박 해커톤 카운트다운 배너 (가장 임박한 것 1개, "지금 참여하기" CTA)
- 진행 중인 해커톤 카드 미리보기 (마감 뱃지 포함)

### 사용 데이터
- `hackathons[]` 에서 `status: 'ongoing'` 인 항목 중 `period.submissionDeadlineAt` 가장 임박한 것 1개를 배너에 표시
- 카드 미리보기는 `status: 'ongoing'` 전체 표시

---

## 2. 해커톤 목록 (`/hackathons`)

### 필수 UI 요소
- 해커톤 카드 리스트 (각 카드 표시 항목):
  - `title`
  - `status` (진행중 / 종료 / 예정)
  - `tags[]`
  - `period.submissionDeadlineAt` (마감일)
  - `period.endAt` (종료일)
  - `thumbnailUrl`
- 카드 클릭 → `/hackathons/:slug` 이동

### 선택 UI 요소
- 상태 필터: `ongoing` / `ended` / `upcoming`
- 태그 필터: `tags[]` 기반 멀티 선택

### 확장 UI 요소
- 마감 뱃지: 24시간 이내 = 빨간색, 여유 = 초록색
- 마감 임박 카드 상단 자동 정렬

### 데이터 스키마
```ts
interface Hackathon {
  slug: string                        // "daker-handover-2026-03"
  title: string                       // "긴급 인수인계 해커톤: 명세서만 보고 구현하라"
  status: 'ongoing' | 'ended' | 'upcoming'
  tags: string[]                      // ["VibeCoding", "Web", "Vercel"]
  thumbnailUrl: string
  period: {
    timezone: string                  // "Asia/Seoul"
    submissionDeadlineAt: string      // "2026-03-30T10:00:00+09:00"
    endAt: string                     // "2026-04-27T10:00:00+09:00"
  }
  links: {
    detail: string                    // "/hackathons/daker-handover-2026-03"
    rules: string
    faq: string
  }
}
```

### 더미 데이터 (`data/hackathons.ts`)
```ts
export const hackathons: Hackathon[] = [
  {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    status: 'ended',
    tags: ['LLM', 'Compression', 'vLLM'],
    thumbnailUrl: 'https://example.com/public/img/aimers8.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-02-25T10:00:00+09:00',
      endAt: '2026-02-26T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/aimers-8-model-lite',
      rules: 'https://example.com/public/rules/aimers8',
      faq: 'https://example.com/public/faq/aimers8',
    },
  },
  {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)',
    status: 'ongoing',
    tags: ['Idea', 'GenAI', 'Workflow'],
    thumbnailUrl: 'https://example.com/public/img/vibe202602.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-03-03T10:00:00+09:00',
      endAt: '2026-03-09T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/monthly-vibe-coding-2026-02',
      rules: 'https://example.com/public/rules/vibe202602',
      faq: 'https://example.com/public/faq/vibe202602',
    },
  },
  {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    status: 'upcoming',
    tags: ['VibeCoding', 'Web', 'Vercel', 'Handover'],
    thumbnailUrl: 'https://example.com/public/img/daker-handover-202603.png',
    period: {
      timezone: 'Asia/Seoul',
      submissionDeadlineAt: '2026-03-30T10:00:00+09:00',
      endAt: '2026-04-27T10:00:00+09:00',
    },
    links: {
      detail: '/hackathons/daker-handover-2026-03',
      rules: 'https://example.com/public/rules/daker-handover-202603',
      faq: 'https://example.com/public/faq/daker-handover-202603',
    },
  },
]
```

---

## 3. 해커톤 상세 (`/hackathons/:slug`)

### 필수 UI 요소
- 7개 탭 전부 필수 구현

#### 탭 1 — 개요 (Overview)
- `sections.overview.summary` 표시
- 팀 구성 정책: `allowSolo` / `maxTeamSize`

#### 탭 2 — 안내 (Info)
- `sections.info.notice[]` 공지 리스트
- 규정/FAQ 외부 링크: `sections.info.links.rules` / `.faq`

#### 탭 3 — 평가 (Eval)
- 평가 지표명: `sections.eval.metricName`
- 설명: `sections.eval.description`
- 점수 방식이 `vote` 인 경우 가중치 breakdown 표시:
  - 참가자 30% / 심사위원 70%
- 제한 사항 (있는 경우): `maxRuntimeSec` / `maxSubmissionsPerDay`

#### 탭 4 — 일정 (Schedule)
- `sections.schedule.milestones[]` 기반 시각적 타임라인
- 각 마일스톤: `name` + `at` (날짜/시간)
- 현재 시각 기준 현재 단계 하이라이트
- 가장 가까운 마감(`submissionDeadlineAt`) 기준 실시간 카운트다운 (시:분:초)
- 마감 24시간 이내 → 빨간색 + 진동 애니메이션
- 미제출 상태 시 "⚠️ 아직 제출하지 않았습니다" 경고

#### 탭 5 — 상금 (Prize)
- `sections.prize.items[]` 표시: `place` + `amountKRW` (원 단위 포맷)

#### 탭 6 — 팀 (Teams)
- `sections.teams.campEnabled` 가 `true` 인 경우에만 표시
- `sections.teams.listUrl` 로 `/camp?hackathon=slug` 연결
- 팀 구성 초대·수락·거절 버튼
- (확장) "이 해커톤으로 시뮬레이션 해보기" → `/camp/simulate`

#### 탭 7 — 제출 (Submit)
- `sections.submit.guide[]` 가이드 텍스트 리스트
- `sections.submit.allowedArtifactTypes[]` 기반 제출 폼 렌더링:
  - `zip` → 파일 업로드
  - `url` → URL 입력
  - `pdf` / `pdf_url` → PDF 업로드 또는 URL
  - `text_or_url` → 텍스트 또는 URL 입력
- `sections.submit.submissionItems[]` 가 있는 경우 단계별 제출 폼으로 렌더링:
  - 예: 기획서(1차) → 웹링크 → PDF 순서로 표시
- 제출 완료 → `submissions[]` 저장 → `leaderboards[]` 업데이트

#### 탭 8 — 리더보드 (Leaderboard)
- `leaderboards[hackathonSlug].entries[]` 표시:
  - `rank` / `teamName` / `score`
  - `score` 표시 방식: 소수점(0.7421) 또는 정수(87.5) 해커톤마다 다름
  - `scoreBreakdown` 있는 경우 참가자/심사위원 점수 breakdown 표시
  - `artifacts` 있는 경우 웹링크·PDF 링크 표시
- 제출 내역 없는 팀 → "미제출" 표시 (순위 없음)
- `leaderboard.note` 안내 문구 하단 표시

### 데이터 스키마
```ts
interface HackathonDetail {
  slug: string
  title: string
  sections: {
    overview: {
      summary: string
      teamPolicy: {
        allowSolo: boolean
        maxTeamSize: number
      }
    }
    info: {
      notice: string[]
      links: {
        rules: string
        faq: string
      }
    }
    eval: {
      metricName: string
      description: string
      scoreSource?: 'metric' | 'vote'
      scoreDisplay?: {
        label: string
        breakdown: {
          key: string
          label: string
          weightPercent: number
        }[]
      }
      limits?: {
        maxRuntimeSec?: number
        maxSubmissionsPerDay?: number
      }
    }
    schedule: {
      timezone: string
      milestones: {
        name: string
        at: string
      }[]
    }
    prize: {
      items: {
        place: string
        amountKRW: number
      }[]
    }
    teams: {
      campEnabled: boolean
      listUrl: string
    }
    submit: {
      allowedArtifactTypes: string[]
      submissionUrl: string
      guide: string[]
      submissionItems?: {
        key: string
        title: string
        format: string
      }[]
    }
    leaderboard: {
      publicLeaderboardUrl: string
      note: string
    }
  }
}
```

---

## 4. 팀원 모집 (`/camp`)

### 필수 UI 요소
- 팀 리스트 카드 (각 카드 표시 항목):
  - `name` (팀명)
  - `intro` (소개)
  - `isOpen` (모집중 여부 뱃지)
  - `lookingFor[]` (모집 포지션 태그)
  - `memberCount` (현재 인원)
  - `contact.url` (연락 링크)
- `/camp?hackathon=slug` 쿼리 → `hackathonSlug` 기준 필터링
- 팀 모집글 생성 폼 (모달):
  - 팀명 (필수)
  - 소개 (필수)
  - 모집중 여부 (`isOpen`)
  - 모집 포지션 (`lookingFor`)
  - 연락 링크 (`contact.url`)
  - (선택) 수정 / 모집마감 처리

### 확장 UI 요소
- 내 프로필 태그 설정 모달 (최초 1회):
  - 역할: 기획 / 프론트엔드 / 백엔드 / 디자인 / 풀스택
  - 기술 스택: 멀티 선택
  - 목표: 수상 / 경험 / 포트폴리오
  - 활동 시간: 오전 / 오후 / 밤 / 주말
- 스와이프 탐색 UI:
  - 오른쪽 스와이프 = 관심 / 왼쪽 스와이프 = 패스
  - 카드: 팀명·소개 / 모집 포지션 / 기술 스택 / 적합도(%) / 추천 이유 / "시뮬레이션 해보기" CTA
  - 관심 표시 시 지원 메시지 입력 (optional)
  - 관심 팀 별도 리스트 저장, 적합도 순 정렬

### 데이터 스키마
```ts
interface Team {
  teamCode: string                  // "T-HANDOVER-01"
  hackathonSlug: string | null      // null이면 해커톤 미연결
  name: string                      // "404found"
  isOpen: boolean
  memberCount: number
  lookingFor: string[]              // ["Frontend", "Designer"]
  intro: string
  contact: {
    type: 'link' | 'form'
    url: string                     // 카카오톡 오픈채팅 or 구글폼
  }
  createdAt: string
}
```

### 더미 데이터 (`data/teams.ts`)
```ts
export const teams: Team[] = [
  {
    teamCode: 'T-ALPHA',
    hackathonSlug: 'aimers-8-model-lite',
    name: 'Team Alpha',
    isOpen: true,
    memberCount: 3,
    lookingFor: ['Backend', 'ML Engineer'],
    intro: '추론 최적화/경량화 실험을 함께 진행할 팀원을 찾습니다.',
    contact: { type: 'link', url: 'https://open.kakao.com/o/example1' },
    createdAt: '2026-02-20T11:00:00+09:00',
  },
  {
    teamCode: 'T-BETA',
    hackathonSlug: 'monthly-vibe-coding-2026-02',
    name: 'PromptRunners',
    isOpen: true,
    memberCount: 1,
    lookingFor: ['Frontend', 'Designer'],
    intro: '프롬프트 품질 점수화 + 개선 가이드 UX를 기획합니다.',
    contact: { type: 'link', url: 'https://forms.gle/example2' },
    createdAt: '2026-02-18T18:30:00+09:00',
  },
  {
    teamCode: 'T-HANDOVER-01',
    hackathonSlug: 'daker-handover-2026-03',
    name: '404found',
    isOpen: true,
    memberCount: 3,
    lookingFor: ['Frontend', 'Designer'],
    intro: '명세서 기반으로 기본 기능을 빠르게 완성하고 UX 확장을 노립니다.',
    contact: { type: 'link', url: 'https://open.kakao.com/o/example3' },
    createdAt: '2026-03-04T11:00:00+09:00',
  },
  {
    teamCode: 'T-HANDOVER-02',
    hackathonSlug: 'daker-handover-2026-03',
    name: 'LGTM',
    isOpen: false,
    memberCount: 5,
    lookingFor: [],
    intro: '기획서-구현-문서화를 깔끔하게 맞추는 방향으로 진행합니다.',
    contact: { type: 'link', url: 'https://forms.gle/example4' },
    createdAt: '2026-03-05T09:20:00+09:00',
  },
]
```

---

## 5. 랭킹 (`/rankings`)

### 필수 UI 요소
- 글로벌 랭킹 테이블: rank / 닉네임 / points
- 기간 필터: 최근 7일 / 최근 30일 / 전체

### 확장 UI 요소
- 순위 변동 표시 (↑ ↓ 아이콘)
- TOP 3 시각적 강조

### 데이터 스키마
```ts
interface RankingEntry {
  rank: number
  nickname: string
  points: number
}
```

---

## 6. 리더보드 데이터

### 데이터 스키마
```ts
interface Leaderboard {
  hackathonSlug: string
  updatedAt: string
  entries: {
    rank: number
    teamName: string
    score: number                   // 소수(0.7421) 또는 정수(87.5) 해커톤마다 다름
    submittedAt: string
    scoreBreakdown?: {              // vote 방식인 경우만
      participant: number
      judge: number
    }
    artifacts?: {                   // 제출물 링크 (있는 경우)
      webUrl?: string
      pdfUrl?: string
      planTitle?: string
    }
  }[]
}
```

### 더미 데이터 (`data/leaderboards.ts`)
```ts
export const leaderboards: Leaderboard[] = [
  {
    hackathonSlug: 'aimers-8-model-lite',
    updatedAt: '2026-02-26T10:00:00+09:00',
    entries: [
      {
        rank: 1,
        teamName: 'Team Alpha',
        score: 0.7421,
        submittedAt: '2026-02-24T21:05:00+09:00',
      },
      {
        rank: 2,
        teamName: 'Team Gamma',
        score: 0.7013,
        submittedAt: '2026-02-25T09:40:00+09:00',
      },
    ],
  },
  {
    hackathonSlug: 'daker-handover-2026-03',
    updatedAt: '2026-04-17T10:00:00+09:00',
    entries: [
      {
        rank: 1,
        teamName: '404found',
        score: 87.5,
        submittedAt: '2026-04-13T09:58:00+09:00',
        scoreBreakdown: { participant: 82, judge: 90 },
        artifacts: {
          webUrl: 'https://404found.vercel.app',
          pdfUrl: 'https://example.com/404found-solution.pdf',
          planTitle: '404found 기획서',
        },
      },
      {
        rank: 2,
        teamName: 'LGTM',
        score: 84.2,
        submittedAt: '2026-04-13T09:40:00+09:00',
        scoreBreakdown: { participant: 79, judge: 88 },
        artifacts: {
          webUrl: 'https://lgtm-hack.vercel.app',
          pdfUrl: 'https://example.com/lgtm-solution.pdf',
          planTitle: 'LGTM 기획서',
        },
      },
    ],
  },
]
```

---

## 7. 팀 빌딩 시뮬레이터 (`/camp/simulate`) ⭐ 핵심 확장

### 개요
태그 기반 계산식으로 팀 완성도를 시뮬레이션하고, 변경 전/후를 비교해 이유를 설명해주는 인터랙티브 도구.

```
적합도 = (태그 일치 × 40%) + (역할 필요도 × 40%) + (활동 시간 유사도 × 20%)
```

### UI 요소
- 상단 토글: 합류자 모드 ↔ 팀장 모드
- 좌측 패널 — 포지션 슬롯 UI:
  - 각 역할을 슬롯으로 표시
  - 내 슬롯은 별도 색상 하이라이트
  - 슬롯 추가 / 제거 버튼
- 우측 패널 — 실시간 분석:
  - 팀 완성도 점수 (%)
  - 리스크 목록 (⚠️ 백엔드 없음 등)
  - 강점 목록 (✅ 프론트 역량 충분 등)
- 하단 패널 — Before / After 비교:
  - 변경 전 점수 vs 변경 후 점수
  - 변화량 강조 (↑ +14%, 초록색)
  - 변화 이유 설명

### 두 가지 모드
| 모드 | 설명 |
|------|------|
| 합류자 모드 | 내가 빈 슬롯에 들어갔을 때 팀 완성도 변화 확인 |
| 팀장 모드 | 내가 슬롯에 있고 나머지를 채웠을 때 변화 확인 |

### 진입 경로
- `/camp` 스와이프 카드의 "시뮬레이션 해보기" 버튼
- `/hackathons/:slug` 팀 탭의 "이 해커톤으로 시뮬레이션 해보기" 버튼

---

## 8. 메시지함 (`/messages`) — 선택

### UI 요소
- 받은 메시지 / 보낸 메시지 탭
- 메시지 목록: 발신자 + 역할 태그 / 팀명 / 미리보기 / 상태 뱃지
- 상태: `pending`(대기중) / `accepted`(수락됨) / `rejected`(거절됨)
- 수락 시 팀의 `contact.url` (카카오톡 등) 외부 링크 연결

### 데이터 스키마
```ts
interface Message {
  id: string
  fromUserId: string
  teamCode: string
  hackathonSlug: string | null
  message: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}
```

---

## 9. 유저 프로필 (`/profile/:id`) — 선택

### UI 요소
- 기본 정보: 닉네임 / 역할 태그 / 기술 스택 / 목표 / 활동 시간
- 스탯: 참여 해커톤 수 / 수상 횟수 / 총 포인트
- 해커톤 참여 이력: 해커톤명 / 순위 / 점수 / 수상 여부
- 제출물 포트폴리오 카드: 썸네일 / 해커톤명 / 수상 뱃지

---

## 10. 쇼케이스 갤러리 (`/showcase`) — 선택

### UI 요소
- 카드 그리드: 썸네일 / 팀명 / 해커톤명 / 수상 뱃지
- 필터: 해커톤별 / 수상작만 보기 / 태그
- 카드 클릭 → 상세 보기: 설명 / `artifacts.webUrl` / `artifacts.pdfUrl` / 팀 프로필 링크

### 사용 데이터
- `leaderboards[].entries[].artifacts` 에서 제출물 정보 활용

---

## 주요 사용 흐름

**흐름 A — 팀 찾기 (합류자)**
메인 → `/camp` → 프로필 태그 설정 → 스와이프 탐색 → 적합도·추천 이유 확인 → 시뮬레이터(합류자 모드) → 지원 메시지 작성 → `/messages` 수락 확인 → `contact.url`로 이동

**흐름 B — 팀 꾸리기 (팀장)**
`/camp` → 팀 생성 모달 → 시뮬레이터(팀장 모드) → 포지션 조정 → 모집글 게시 → `/messages` 수락·거절 처리

**흐름 C — 해커톤 참가**
`/hackathons` → 마감 뱃지 확인 → 상세 페이지 → 일정 탭 카운트다운 → 제출 탭 업로드 → 리더보드 반영

**흐름 D — 랭킹 확인**
`/rankings` → 기간 필터 → 글로벌 유저 순위 확인
