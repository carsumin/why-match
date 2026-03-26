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
      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 ${className}`}
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
    colorClass = 'bg-gray-200 text-gray-500';
  } else if (diffDays <= 3) {
    label = `D-${diffDays}`;
    colorClass = 'bg-red-100 text-red-600';
  } else if (diffDays <= 7) {
    label = `D-${diffDays}`;
    colorClass = 'bg-orange-100 text-orange-600';
  } else {
    label = `D-${diffDays}`;
    colorClass = 'bg-green-100 text-green-600';
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
  high: { label: 'High Match', colorClass: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium Match', colorClass: 'bg-yellow-100 text-yellow-700' },
  low: { label: 'Low Match', colorClass: 'bg-gray-100 text-gray-500' },
};

export function MatchLevelBadge({ level, score }: MatchLevelBadgeProps) {
  const { label, colorClass } = levelConfig[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full ${colorClass}`}>
      {label} <span className="font-bold">{score}%</span>
    </span>
  );
}
