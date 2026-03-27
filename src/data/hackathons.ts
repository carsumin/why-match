// 해커톤 더미 데이터 — SPEC.md 기준

import type { HackathonListItem, HackathonDetail } from '@/types';

// ──────────────────────────────
// 해커톤 목록 데이터
// ──────────────────────────────
export const hackathonList: HackathonListItem[] = [
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
];

// ──────────────────────────────
// 해커톤 상세 데이터 (sections 포함)
// ──────────────────────────────
export const hackathonDetails: HackathonDetail[] = [
  {
    slug: 'aimers-8-model-lite',
    title: 'Aimers 8기 : 모델 경량화 온라인 해커톤',
    sections: {
      overview: {
        summary:
          'vLLM 또는 llama.cpp 기반으로 LLM을 경량화하여 추론 속도와 메모리 효율을 최대화하는 온라인 해커톤입니다. 주어진 기준 모델(Qwen2.5-7B)을 압축·양자화하여 Top-1 Accuracy를 최대한 유지하면서 추론 속도를 높이는 것이 목표입니다.',
        teamPolicy: { allowSolo: false, maxTeamSize: 4 },
        notice: [
          '제출은 팀 단위로만 허용됩니다. (2인 이상)',
          '외부 오픈소스 모델 사용 가능하나 사전 학습은 금지입니다.',
          '제출 파일은 ZIP으로 압축 후 업로드해주세요.',
          '최종 제출 전 로컬 환경에서 실행 가능 여부를 반드시 확인하세요.',
        ],
        infoLinks: {
          rules: 'https://example.com/public/rules/aimers8',
          faq: 'https://example.com/public/faq/aimers8',
        },
      },
      eval: {
        metricName: 'Top-1 Accuracy on Test Set',
        description:
          '제공된 테스트 데이터셋에서 경량화된 모델의 Top-1 Accuracy를 측정합니다. 동점 시 추론 속도(tokens/sec) 기준으로 순위를 결정합니다.',
        scoreSource: 'metric',
        limits: { maxRuntimeSec: 300, maxSubmissionsPerDay: 5 },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '참가 신청 마감', at: '2026-02-10T23:59:00+09:00' },
          { name: '데이터셋 공개', at: '2026-02-11T10:00:00+09:00' },
          { name: '제출 마감', at: '2026-02-25T10:00:00+09:00' },
          { name: '최종 평가 완료', at: '2026-02-26T10:00:00+09:00' },
          { name: '수상자 발표', at: '2026-02-28T14:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '대상 (1팀)', amountKRW: 3000000 },
          { place: '최우수상 (1팀)', amountKRW: 1500000 },
          { place: '우수상 (2팀)', amountKRW: 500000 },
        ],
      },
      teams: {
        campEnabled: false,
        listUrl: '/camp?hackathon=aimers-8-model-lite',
      },
      submit: {
        allowedArtifactTypes: ['zip'],
        submissionUrl: 'https://example.com/submit/aimers8',
        guide: [
          '모델 파일과 추론 코드를 ZIP으로 압축하여 업로드하세요.',
          'README.md에 모델 설명 및 실행 방법을 반드시 포함하세요.',
          'requirements.txt 또는 environment.yaml 파일을 포함하세요.',
          '제출 전 로컬 환경에서 정상 실행되는지 확인하세요.',
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: 'https://example.com/leaderboard/aimers8',
        note: '리더보드는 제출 마감 후 최종 업데이트되었습니다. 동점 시 추론 속도(tokens/sec) 기준으로 순위를 결정합니다.',
      },
    },
  },
  {
    slug: 'monthly-vibe-coding-2026-02',
    title: '월간 해커톤 : 바이브 코딩 개선 AI 아이디어 공모전 (2026.02)',
    sections: {
      overview: {
        summary:
          'AI 기반 바이브 코딩(Vibe Coding) 경험을 개선하는 아이디어를 공모합니다. GenAI 도구를 활용한 워크플로우 개선, 자동화, 협업 강화 등 다양한 아이디어를 환영합니다. 프로토타입 구현 또는 기획서 제출 모두 가능합니다.',
        teamPolicy: { allowSolo: true, maxTeamSize: 3 },
        notice: [
          '개인 또는 최대 3인 팀으로 참가 가능합니다.',
          'AI 도구(ChatGPT, Claude, Cursor 등) 활용을 권장합니다.',
          '실제 구현 없이 기획서만으로도 참가 가능합니다.',
          '중복 제출 및 기제출 작품은 심사에서 제외됩니다.',
        ],
        infoLinks: {
          rules: 'https://example.com/public/rules/vibe202602',
          faq: 'https://example.com/public/faq/vibe202602',
        },
      },
      eval: {
        metricName: '종합 심사 점수',
        description:
          '참가자 상호 투표(30%)와 전문 심사위원 평가(70%)를 합산한 종합 점수로 순위를 결정합니다. 심사 기준: 창의성 30% / 실현 가능성 25% / 임팩트 25% / 완성도 20%.',
        scoreSource: 'vote',
        scoreDisplay: {
          label: '종합 점수',
          breakdown: [
            { key: 'participant', label: '참가자 투표', weightPercent: 30 },
            { key: 'judge', label: '심사위원 평가', weightPercent: 70 },
          ],
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '참가 신청 오픈', at: '2026-02-01T10:00:00+09:00' },
          { name: '아이디어 제출 마감', at: '2026-03-03T10:00:00+09:00' },
          { name: '참가자 상호 투표', at: '2026-03-04T10:00:00+09:00' },
          { name: '심사위원 평가 완료', at: '2026-03-07T18:00:00+09:00' },
          { name: '최종 결과 발표', at: '2026-03-09T14:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '대상 (1팀)', amountKRW: 2000000 },
          { place: '최우수상 (2팀)', amountKRW: 1000000 },
          { place: '우수상 (3팀)', amountKRW: 300000 },
          { place: '장려상 (5팀)', amountKRW: 100000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=monthly-vibe-coding-2026-02',
      },
      submit: {
        allowedArtifactTypes: ['pdf', 'url'],
        submissionUrl: 'https://example.com/submit/vibe202602',
        guide: [
          '기획서(PDF)와 데모 링크(URL) 중 하나 이상을 제출해야 합니다.',
          '기획서는 A4 기준 최대 20페이지 이내로 작성해주세요.',
          '데모 링크는 접근 가능한 공개 URL이어야 합니다.',
          '발표 자료는 별도 제출 양식을 통해 업로드하세요.',
        ],
        submissionItems: [
          { key: 'plan', title: '기획서 (1차)', format: 'pdf' },
          { key: 'demo', title: '데모 링크', format: 'url' },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: 'https://example.com/leaderboard/vibe202602',
        note: '참가자 투표는 제출 마감 다음 날 24시간 동안 진행됩니다. 심사위원 평가 결과는 최종 발표일에 공개됩니다.',
      },
    },
  },
  {
    slug: 'daker-handover-2026-03',
    title: '긴급 인수인계 해커톤: 명세서만 보고 구현하라',
    sections: {
      overview: {
        summary:
          '전임자가 남긴 SPEC.md 하나만 들고 서비스를 완성하는 실전형 해커톤입니다. 기술 문서 독해 능력, 빠른 프로토타이핑, 팀 협업을 동시에 평가합니다. 완성도보다 "왜 이렇게 구현했는가"에 대한 이유를 중시합니다.',
        teamPolicy: { allowSolo: false, maxTeamSize: 5 },
        notice: [
          '팀 구성은 2인 이상 5인 이하입니다.',
          '제공된 SPEC.md 이외에 기존 코드베이스 참고는 허용됩니다.',
          'AI 코딩 도구(Cursor, Copilot 등) 사용 가능합니다.',
          '제출물은 공개 GitHub 저장소 링크와 배포 URL을 포함해야 합니다.',
          '발표는 5분 데모 + 5분 Q&A 형식입니다.',
        ],
        infoLinks: {
          rules: 'https://example.com/public/rules/daker-handover-202603',
          faq: 'https://example.com/public/faq/daker-handover-202603',
        },
      },
      eval: {
        metricName: '종합 심사 점수',
        description:
          '참가자 상호 투표(30%)와 심사위원 평가(70%)로 결정됩니다. 심사 기준: 명세서 충실도 30% / 코드 품질 20% / UX·완성도 20% / 이유 설명력 30%.',
        scoreSource: 'vote',
        scoreDisplay: {
          label: '종합 점수',
          breakdown: [
            { key: 'participant', label: '참가자 투표', weightPercent: 30 },
            { key: 'judge', label: '심사위원 평가', weightPercent: 70 },
          ],
        },
      },
      schedule: {
        timezone: 'Asia/Seoul',
        milestones: [
          { name: '팀 모집 시작', at: '2026-03-04T10:00:00+09:00' },
          { name: '팀 모집 마감', at: '2026-03-30T10:00:00+09:00' },
          { name: '해커톤 시작 (SPEC.md 공개)', at: '2026-04-01T10:00:00+09:00' },
          { name: '중간 점검 (선택)', at: '2026-04-10T14:00:00+09:00' },
          { name: '제출 마감', at: '2026-04-13T23:59:00+09:00' },
          { name: '참가자 투표', at: '2026-04-14T10:00:00+09:00' },
          { name: '발표 및 시상', at: '2026-04-27T10:00:00+09:00' },
        ],
      },
      prize: {
        items: [
          { place: '대상 (1팀)', amountKRW: 5000000 },
          { place: '최우수상 (1팀)', amountKRW: 2000000 },
          { place: '우수상 (2팀)', amountKRW: 500000 },
          { place: '장려상 (3팀)', amountKRW: 200000 },
        ],
      },
      teams: {
        campEnabled: true,
        listUrl: '/camp?hackathon=daker-handover-2026-03',
      },
      submit: {
        allowedArtifactTypes: ['url', 'pdf_url'],
        submissionUrl: 'https://example.com/submit/daker-handover-202603',
        guide: [
          'GitHub 저장소는 반드시 public으로 설정하세요.',
          '배포 URL은 제출 마감일까지 접근 가능해야 합니다.',
          '기획서/발표자료는 PDF URL 또는 구글 드라이브 링크로 제출하세요.',
          'README.md에 실행 방법과 구현 이유를 반드시 작성하세요.',
        ],
        submissionItems: [
          { key: 'repo', title: '깃헙 저장소', format: 'url' },
          { key: 'deploy', title: '배포 URL', format: 'url' },
          { key: 'plan', title: '기획서/발표자료', format: 'pdf_url' },
        ],
      },
      leaderboard: {
        publicLeaderboardUrl: 'https://example.com/leaderboard/daker-handover-202603',
        note: '점수는 참가자 투표(30%)와 심사위원 평가(70%)를 합산하여 산출됩니다. scoreBreakdown을 통해 각 항목별 점수를 확인할 수 있습니다.',
      },
    },
  },
];

// ──────────────────────────────
// 헬퍼 함수
// ──────────────────────────────

/** slug로 목록 아이템 조회 */
export function getHackathonListItem(slug: string): HackathonListItem | undefined {
  return hackathonList.find((h) => h.slug === slug);
}

/** slug로 상세 데이터 조회 */
export function getHackathonDetail(slug: string): HackathonDetail | undefined {
  return hackathonDetails.find((h) => h.slug === slug);
}

/** 진행 중인 해커톤 중 마감이 가장 임박한 것 반환 */
export function getNearestOngoingHackathon(): HackathonListItem | undefined {
  const ongoing = hackathonList.filter((h) => h.status === 'ongoing');
  if (ongoing.length === 0) return undefined;
  return ongoing.reduce((nearest, current) => {
    const nearestTime = new Date(nearest.period.submissionDeadlineAt).getTime();
    const currentTime = new Date(current.period.submissionDeadlineAt).getTime();
    return currentTime < nearestTime ? current : nearest;
  });
}
