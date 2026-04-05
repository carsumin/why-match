'use client';

// 메인 페이지 카운트다운 배너 — 실시간 타이머

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { HackathonListItem } from '@/types';

interface CountdownBannerProps {
  hackathon: HackathonListItem;
}

/** 남은 시간을 "D-N일 HH:MM:SS" 형식으로 계산 */
function calcRemaining(deadlineIso: string): string {
  const diff = new Date(deadlineIso).getTime() - Date.now();
  if (diff <= 0) return '마감';

  const totalSecs = Math.floor(diff / 1000);
  const days = Math.floor(totalSecs / 86400);
  const hours = Math.floor((totalSecs % 86400) / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(mins).padStart(2, '0');
  const ss = String(secs).padStart(2, '0');

  if (days > 0) return `D-${days}일 ${hh}:${mm}:${ss}`;
  return `${hh}:${mm}:${ss}`;
}

export default function CountdownBanner({ hackathon }: CountdownBannerProps) {
  const [remaining, setRemaining] = useState(
    calcRemaining(hackathon.period.submissionDeadlineAt),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(calcRemaining(hackathon.period.submissionDeadlineAt));
    }, 1000);
    return () => clearInterval(id);
  }, [hackathon.period.submissionDeadlineAt]);

  return (
    <div className="w-full bg-[#dde4f5] text-slate-900 py-3 px-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap">
        <p className="text-sm font-medium">
          ⏰ <strong>{hackathon.title}</strong> 팀 모집 마감 임박!
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-bold bg-[#4f72c4] text-white px-3 py-1 rounded-full">
            {remaining}
          </span>
          <Link
            href={hackathon.links.detail}
            className="text-xs font-semibold glass text-slate-700 px-3 py-1 rounded-full hover:bg-[#eef1fb] transition-colors"
          >
            지금 참여하기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
