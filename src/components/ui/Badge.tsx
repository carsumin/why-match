// 공통 뱃지 컴포넌트 — 태그 뱃지, D-day 뱃지, 매칭 레벨 뱃지

import type { MatchLevel } from '@/types';

// ──────────────────────────────
// 태그 뱃지
// ──────────────────────────────
interface TagBadgeProps {
  label: string;
  className?: string;
}

export function TagBadge({ label, className = '' }: TagBadgeProps) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-sky-100 text-sky-700 ${className}`}
    >
      {label}
    </span>
  );
}

// ──────────────────────────────
// D-day 뱃지
// ──────────────────────────────
interface DdayBadgeProps {
  deadline: string; // ISO 8601
}

export function DdayBadge({ deadline }: DdayBadgeProps) {
  const now = new Date();
  const end = new Date(deadline);
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  let label: string;
  let colorClass: string;

  if (diffMs <= 0) {
    label = '마감';
    colorClass = 'bg-gray-100 text-gray-400';
  } else if (diffDays <= 3) {
    label = `D-${diffDays}`;
    colorClass = 'bg-red-50 text-red-500 border border-red-200';
  } else if (diffDays <= 7) {
    label = `D-${diffDays}`;
    colorClass = 'bg-orange-50 text-orange-500 border border-orange-200';
  } else {
    label = `D-${diffDays}`;
    colorClass = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
  }

  return (
    <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full ${colorClass}`}>
      {label}
    </span>
  );
}

// ──────────────────────────────
// 매칭 레벨 뱃지
// ──────────────────────────────
interface MatchLevelBadgeProps {
  level: MatchLevel;
  score: number;
}

const levelConfig: Record<MatchLevel, { label: string; colorClass: string }> = {
  high: { label: 'High Match', colorClass: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  medium: { label: 'Medium Match', colorClass: 'bg-yellow-50 text-yellow-600 border border-yellow-200' },
  low: { label: 'Low Match', colorClass: 'bg-gray-100 text-gray-400 border border-gray-200' },
};

export function MatchLevelBadge({ level, score }: MatchLevelBadgeProps) {
  const { label, colorClass } = levelConfig[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
      {label} <span className="font-bold">{score}%</span>
    </span>
  );
}
