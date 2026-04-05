'use client';

// 해커톤 목록 페이지 — 상태 필터, 태그 필터, 카드 그리드

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { hackathonList } from '@/data/hackathons';
import { TagBadge, DdayBadge } from '@/components/ui/Badge';
import type { HackathonStatus } from '@/types';

const STATUS_LABELS: Record<HackathonStatus | 'all', string> = {
  all: '전체',
  ongoing: '진행중',
  ended: '종료',
  upcoming: '예정',
};

const STATUS_BADGE: Record<HackathonStatus, string> = {
  ongoing: 'bg-green-50 text-green-700',
  ended: 'bg-white text-gray-500',
  upcoming: 'bg-blue-100 text-blue-700',
};

// 모든 태그를 중복 없이 수집
const allTags = Array.from(new Set(hackathonList.flatMap((h) => h.tags)));

export default function HackathonsPage() {
  const [statusFilter, setStatusFilter] = useState<HackathonStatus | 'all'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    return hackathonList
      .filter((h) => statusFilter === 'all' || h.status === statusFilter)
      .filter((h) => selectedTags.length === 0 || selectedTags.every((t) => h.tags.includes(t)))
      .sort((a, b) => {
        // ongoing 우선, 그 다음 마감 시간 빠른 순
        if (a.status === 'ongoing' && b.status !== 'ongoing') return -1;
        if (a.status !== 'ongoing' && b.status === 'ongoing') return 1;
        return (
          new Date(a.period.submissionDeadlineAt).getTime() -
          new Date(b.period.submissionDeadlineAt).getTime()
        );
      });
  }, [statusFilter, selectedTags]);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">해커톤 목록</h1>

      {/* 상태 필터 */}
      <div className="flex gap-2 flex-wrap mb-4">
        {(Object.keys(STATUS_LABELS) as (HackathonStatus | 'all')[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-[#dde4f5] text-slate-900'
                : 'bg-white text-slate-600 hover:bg-[#eef1fb]'
            }`}
          >
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      {/* 태그 필터 (멀티 선택) */}
      <div className="flex gap-2 flex-wrap mb-8">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-[#4f72c4] text-white'
                : 'bg-[#eef1fb] text-slate-700 hover:bg-[#dde4f5]'
            }`}
          >
            {tag}
          </button>
        ))}
        {selectedTags.length > 0 && (
          <button
            onClick={() => setSelectedTags([])}
            className="px-3 py-1 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 underline"
          >
            초기화
          </button>
        )}
      </div>

      {/* 카드 그리드 */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((hackathon) => (
            <Link
              key={hackathon.slug}
              href={hackathon.links.detail}
              className="group flex flex-col glass rounded-2xl border border-[#dde4f5] shadow-sm hover:shadow-md hover:border-[#4f72c4] transition-all overflow-hidden"
            >
              {/* 썸네일 플레이스홀더 */}
              <div className="h-32 bg-[#eef1fb] flex items-center justify-center text-4xl select-none">
                {hackathon.status === 'ongoing'
                  ? '🔥'
                  : hackathon.status === 'upcoming'
                    ? '⏳'
                    : '✅'}
              </div>

              <div className="p-5 flex flex-col flex-1">
                {/* 상태 + D-day */}
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[hackathon.status]}`}
                  >
                    {STATUS_LABELS[hackathon.status]}
                  </span>
                  {hackathon.status !== 'ended' && (
                    <DdayBadge deadline={hackathon.period.submissionDeadlineAt} status={hackathon.status} startAt={hackathon.period.startAt} />
                  )}
                </div>

                {/* 제목 */}
                <h2 className="text-sm font-bold text-gray-900 line-clamp-2 mb-3 flex-1 leading-snug">
                  {hackathon.title}
                </h2>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {hackathon.tags.map((tag) => (
                    <TagBadge key={tag} label={tag} />
                  ))}
                </div>

                {/* 마감일 */}
                <p className="text-xs text-gray-400">
                  마감:{' '}
                  {new Date(hackathon.period.submissionDeadlineAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* 빈 상태 */
        <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-lg font-semibold text-gray-600 mb-1">
            조건에 맞는 해커톤이 없습니다
          </p>
          <p className="text-sm">필터를 변경하거나 초기화해보세요.</p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setSelectedTags([]);
            }}
            className="mt-4 px-4 py-2 rounded-full bg-[#eef1fb] text-slate-700 text-sm font-medium hover:bg-[#dde4f5] transition-colors"
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  );
}
