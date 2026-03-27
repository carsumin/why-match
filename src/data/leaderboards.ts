// 리더보드 + 글로벌 랭킹 더미 데이터 — SPEC.md 기준

import type { Leaderboard, GlobalRankingEntry } from '@/types';

// ──────────────────────────────
// 해커톤별 리더보드
// ──────────────────────────────
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
];

// ──────────────────────────────
// 글로벌 랭킹 (더미 10명)
// ──────────────────────────────
export const globalRankings: GlobalRankingEntry[] = [
  { rank: 1, nickname: '404found', points: 4200, delta: 0 },
  { rank: 2, nickname: 'AlphaOne', points: 3870, delta: 2 },
  { rank: 3, nickname: 'LGTM', points: 3650, delta: -1 },
  { rank: 4, nickname: 'PromptRunner', points: 3100, delta: 1 },
  { rank: 5, nickname: 'DeepDiver', points: 2890, delta: -1 },
  { rank: 6, nickname: 'ByteForge', points: 2640, delta: 3 },
  { rank: 7, nickname: 'NullPointer', points: 2410, delta: 0 },
  { rank: 8, nickname: 'CodeBuster', points: 2200, delta: -2 },
  { rank: 9, nickname: 'DataDreamer', points: 1980, delta: 1 },
  { rank: 10, nickname: 'Web3Pioneer', points: 1750, delta: -1 },
];

// ──────────────────────────────
// 헬퍼 함수
// ──────────────────────────────

/** hackathonSlug로 리더보드 조회 */
export function getLeaderboard(hackathonSlug: string): Leaderboard | undefined {
  return leaderboards.find((lb) => lb.hackathonSlug === hackathonSlug);
}
