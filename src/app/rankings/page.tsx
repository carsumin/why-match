'use client';

// 랭킹 페이지 — 유저별 프로필 점수 기준 순위 + 점수 세부 내역

import { useMemo } from 'react';
import Link from 'next/link';
import { users } from '@/data/teams';
import { calcUserScore } from '@/utils/matching';
import { useCurrentUser } from '@/hooks/useCurrentUser';

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

const roleLabel: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  designer: '디자이너',
  pm: 'PM',
  data: '데이터',
  devops: 'DevOps',
};

function ScoreBreakdown({ tagScore, roleScore, timeScore }: { tagScore: number; roleScore: number; timeScore: number }) {
  return (
    <p className="text-xs text-gray-400 mt-0.5">
      기술 <span className="text-gray-600 font-medium">{tagScore}</span>
      {' · '}역할 <span className="text-gray-600 font-medium">{roleScore}</span>
      {' · '}활동 <span className="text-gray-600 font-medium">{timeScore}</span>
    </p>
  );
}

function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-gray-500 w-5 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] text-gray-500 w-6 text-right shrink-0">{score}</span>
    </div>
  );
}

export default function RankingsPage() {
  const { currentUser } = useCurrentUser();

  const ranked = useMemo(() =>
    users
      .map((u) => ({ user: u, ...calcUserScore(u) }))
      .sort((a, b) => b.score - a.score)
      .map((entry, i) => ({ ...entry, rank: i + 1 })),
  []);

  const myEntry = currentUser ? ranked.find((e) => e.user.id === currentUser.id) : null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">유저 랭킹</h1>
      <p className="text-sm text-gray-500 mb-1">프로필 점수 기준 참가자 순위입니다.</p>
      <p className="text-xs text-gray-400 mb-6">
        기술 다양성 <span className="font-semibold">40%</span>
        {' · '}역할 다양성 <span className="font-semibold">40%</span>
        {' · '}활동성 <span className="font-semibold">20%</span>
      </p>

      {/* 내 순위 */}
      {myEntry && (
        <div className="mb-6 px-4 py-3 rounded-2xl bg-sky-100 border border-sky-200 flex items-center gap-3">
          <span className="text-lg font-extrabold text-sky-700">
            {TOP3_EMOJI[myEntry.rank] ?? `#${myEntry.rank}`}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">
              {myEntry.user.name}
              <span className="ml-1 text-xs font-normal text-sky-600">(나)</span>
            </p>
            <ScoreBreakdown tagScore={myEntry.tagScore} roleScore={myEntry.roleScore} timeScore={myEntry.timeScore} />
          </div>
          <span className="text-lg font-extrabold text-sky-700">{myEntry.score}점</span>
        </div>
      )}

      {/* TOP 3 카드 */}
      {ranked.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 0, 2].map((idx) => {
            const e = ranked[idx];
            if (!e) return null;
            const isFirst = e.rank === 1;
            return (
              <Link
                key={e.rank}
                href={`/profile/${e.user.id}`}
                className={`flex flex-col items-center p-4 rounded-2xl border hover:shadow-lg transition-shadow ${TOP3_ROW[e.rank] ?? 'bg-white border-sky-100'} ${isFirst ? 'scale-105 shadow-md' : ''}`}
              >
                <span className="text-3xl mb-1">{TOP3_EMOJI[e.rank]}</span>
                <p className="text-sm font-extrabold text-gray-900 truncate w-full text-center mb-0.5">{e.user.name}</p>
                <p className={`text-lg font-extrabold mb-3 ${TOP3_RANK[e.rank] ?? 'text-gray-600'}`}>{e.score}점</p>
                <div className="w-full space-y-1.5">
                  <ScoreBar label="기술" score={e.tagScore} color="bg-sky-400" />
                  <ScoreBar label="역할" score={e.roleScore} color="bg-indigo-400" />
                  <ScoreBar label="활동" score={e.timeScore} color="bg-green-400" />
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* 전체 랭킹 */}
      <div className="space-y-2">
        {ranked.map((entry) => {
          const isMe = currentUser?.id === entry.user.id;
          return (
            <Link
              key={entry.user.id}
              href={`/profile/${entry.user.id}`}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl border transition-colors ${
                isMe
                  ? 'border-sky-300 bg-sky-50'
                  : TOP3_ROW[entry.rank] ?? 'bg-white border-sky-100 hover:border-sky-300'
              }`}
            >
              <div className={`w-8 text-center font-extrabold text-sm shrink-0 ${TOP3_RANK[entry.rank] ?? 'text-gray-400'}`}>
                {TOP3_EMOJI[entry.rank] ?? `#${entry.rank}`}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {entry.user.name}
                  {isMe && <span className="ml-1 text-xs text-sky-500 font-normal">(나)</span>}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {entry.user.roles.map((r) => roleLabel[r] ?? r).join(' · ')}
                </p>
                <ScoreBreakdown tagScore={entry.tagScore} roleScore={entry.roleScore} timeScore={entry.timeScore} />
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-extrabold text-gray-700">{entry.score}점</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
