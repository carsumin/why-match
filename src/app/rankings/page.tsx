'use client';

// 랭킹 페이지 — 글로벌 랭킹 테이블, 기간 필터, TOP 3 강조

import { useState, useMemo } from 'react';
import { globalRankings } from '@/data/leaderboards';

type PeriodFilter = 'all' | '30d' | '7d';

const PERIOD_LABELS: Record<PeriodFilter, string> = {
  all: '전체',
  '30d': '최근 30일',
  '7d': '최근 7일',
};

/** TOP 3 배경/텍스트 스타일 */
const TOP3_ROW: Record<number, string> = {
  1: 'bg-yellow-50 border-yellow-100',
  2: 'bg-sky-50 border-sky-100',
  3: 'bg-orange-50 border-orange-100',
};
const TOP3_RANK: Record<number, string> = {
  1: 'text-yellow-600',
  2: 'text-gray-400',
  3: 'text-orange-400',
};
const TOP3_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

/** 기간 필터에 따라 점수를 가상으로 조정 (더미 처리) */
function applyPeriodFilter(period: PeriodFilter) {
  if (period === 'all') return globalRankings;
  // 더미: 30일은 상위 7명, 7일은 상위 5명만 표시 (점수 조정)
  const count = period === '30d' ? 7 : 5;
  return globalRankings
    .slice(0, count)
    .map((entry, i) => ({
      ...entry,
      rank: i + 1,
      points: Math.floor(entry.points * (period === '7d' ? 0.3 : 0.6)),
    }));
}

export default function RankingsPage() {
  const [period, setPeriod] = useState<PeriodFilter>('all');

  const entries = useMemo(() => applyPeriodFilter(period), [period]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-2">글로벌 랭킹</h1>
      <p className="text-sm text-gray-500 mb-6">누적 포인트 기준 참가자 순위입니다.</p>

      {/* 기간 필터 */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(PERIOD_LABELS) as PeriodFilter[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              period === p
                ? 'bg-sky-100 text-gray-900'
                : 'bg-white text-gray-600 hover:bg-sky-50'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* TOP 3 시각적 강조 */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 0, 2].map((idx) => {
            const e = entries[idx];
            if (!e) return null;
            const isFirst = e.rank === 1;
            return (
              <div
                key={e.rank}
                className={`flex flex-col items-center p-4 rounded-2xl border text-center ${TOP3_ROW[e.rank] ?? 'bg-white border-sky-100'} ${isFirst ? 'scale-105 shadow-md' : ''}`}
              >
                <span className="text-3xl mb-1">{TOP3_EMOJI[e.rank]}</span>
                <p className="text-sm font-extrabold text-gray-900 truncate w-full text-center">
                  {e.nickname}
                </p>
                <p className={`text-lg font-extrabold ${TOP3_RANK[e.rank] ?? 'text-gray-600'}`}>
                  {e.points.toLocaleString()}p
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* 전체 랭킹 테이블 */}
      {entries.length > 0 ? (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={`${entry.rank}-${entry.nickname}`}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-colors ${
                TOP3_ROW[entry.rank] ?? 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              {/* 순위 */}
              <div className={`w-8 text-center font-extrabold ${TOP3_RANK[entry.rank] ?? 'text-gray-400'}`}>
                {TOP3_EMOJI[entry.rank] ?? `#${entry.rank}`}
              </div>

              {/* 닉네임 */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{entry.nickname}</p>
              </div>

              {/* 순위 변동 */}
              {entry.delta !== undefined && entry.delta !== 0 && (
                <div
                  className={`text-xs font-bold ${
                    entry.delta > 0 ? 'text-green-500' : 'text-red-400'
                  }`}
                >
                  {entry.delta > 0 ? `↑${entry.delta}` : `↓${Math.abs(entry.delta)}`}
                </div>
              )}
              {entry.delta === 0 && (
                <div className="text-xs text-gray-300 font-bold">—</div>
              )}

              {/* 포인트 */}
              <div className="text-right">
                <p className="text-sm font-extrabold text-gray-700">
                  {entry.points.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">📊</p>
          <p className="text-sm font-semibold text-gray-600">이 기간에 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
