'use client';

// 일정 탭 실시간 카운트다운 타이머

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadlineIso: string;
}

function calcParts(deadlineIso: string) {
  const diff = new Date(deadlineIso).getTime() - Date.now();
  if (diff <= 0) return null;

  const totalSecs = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSecs / 86400),
    hours: Math.floor((totalSecs % 86400) / 3600),
    mins: Math.floor((totalSecs % 3600) / 60),
    secs: totalSecs % 60,
    isUrgent: diff < 86400 * 1000, // 24시간 이내
  };
}

export default function CountdownTimer({ deadlineIso }: CountdownTimerProps) {
  const [parts, setParts] = useState(calcParts(deadlineIso));

  useEffect(() => {
    const id = setInterval(() => setParts(calcParts(deadlineIso)), 1000);
    return () => clearInterval(id);
  }, [deadlineIso]);

  if (!parts) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-semibold">
        마감되었습니다
      </div>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');
  const urgentClass = parts.isUrgent ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-indigo-50 border-indigo-100';
  const textClass = parts.isUrgent ? 'text-red-600' : 'text-indigo-700';

  return (
    <div className={`inline-flex items-center gap-1 px-4 py-2 rounded-xl border ${urgentClass}`}>
      {parts.days > 0 && (
        <>
          <span className={`text-xl font-extrabold font-mono ${textClass}`}>{parts.days}</span>
          <span className={`text-sm ${textClass} mr-2`}>일</span>
        </>
      )}
      <span className={`text-xl font-extrabold font-mono ${textClass}`}>{pad(parts.hours)}</span>
      <span className={`text-sm ${textClass}`}>:</span>
      <span className={`text-xl font-extrabold font-mono ${textClass}`}>{pad(parts.mins)}</span>
      <span className={`text-sm ${textClass}`}>:</span>
      <span className={`text-xl font-extrabold font-mono ${textClass}`}>{pad(parts.secs)}</span>
      {parts.isUrgent && (
        <span className="ml-2 text-xs font-bold text-red-500">⚠️ 마감 임박</span>
      )}
    </div>
  );
}
