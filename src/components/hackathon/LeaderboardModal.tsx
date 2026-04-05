'use client';

// 공개 리더보드 모달

import { useEffect } from 'react';
import type { Leaderboard } from '@/types';

interface LeaderboardModalProps {
  hackathonTitle: string;
  submissionDeadlineAt: string;
  leaderboard: Leaderboard | undefined;
  note: string;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function LeaderboardModal({
  hackathonTitle,
  submissionDeadlineAt,
  leaderboard,
  note,
  onClose,
}: LeaderboardModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const hasEntries = leaderboard && leaderboard.entries.length > 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center">
        <div
          className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col w-full md:max-w-lg md:mx-4"
          style={{ maxHeight: '85dvh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 드래그 핸들 (모바일) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-gray-900">🏆 공개 리더보드</h2>
              <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">{hackathonTitle}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* 본문 */}
          <div className="overflow-y-auto flex-1 px-5 py-5">
            {hasEntries ? (
              <div className="space-y-4">
                {/* 업데이트 시각 */}
                <p className="text-xs text-gray-400">
                  최종 업데이트: {formatDate(leaderboard.updatedAt)}
                </p>

                {/* 순위 목록 */}
                <div className="space-y-2">
                  {leaderboard.entries.map((entry) => (
                    <div
                      key={entry.rank}
                      className={`flex items-center gap-3 p-4 rounded-2xl ${
                        entry.rank === 1
                          ? 'bg-yellow-50 border border-yellow-100'
                          : entry.rank === 2
                            ? 'bg-gray-50 border border-gray-100'
                            : entry.rank === 3
                              ? 'bg-orange-50 border border-orange-100'
                              : 'bg-white border border-[#dde4f5]'
                      }`}
                    >
                      {/* 순위 배지 */}
                      <span className="text-xl w-8 text-center shrink-0">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                      </span>

                      {/* 팀 정보 */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-gray-900">{entry.teamName}</p>
                        {entry.scoreBreakdown && (
                          <p className="text-xs text-gray-400 mt-0.5">
                            참가자 {entry.scoreBreakdown.participant}점 · 심사위원 {entry.scoreBreakdown.judge}점
                          </p>
                        )}
                        {entry.artifacts && (
                          <div className="flex gap-3 mt-1.5">
                            {entry.artifacts.webUrl && (
                              <a
                                href={entry.artifacts.webUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#4f72c4] hover:underline font-medium"
                              >
                                🔗 데모
                              </a>
                            )}
                            {entry.artifacts.pdfUrl && (
                              <a
                                href={entry.artifacts.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-[#4f72c4] hover:underline font-medium"
                              >
                                📄 {entry.artifacts.planTitle ?? 'PDF'}
                              </a>
                            )}
                          </div>
                        )}
                      </div>

                      {/* 점수 */}
                      <span className={`text-base font-extrabold shrink-0 ${
                        entry.rank === 1 ? 'text-yellow-600' : entry.rank === 2 ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {typeof entry.score === 'number' && entry.score < 2
                          ? entry.score.toFixed(4)
                          : entry.score.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 비고 */}
                <p className="text-xs text-gray-400 pt-2 border-t border-[#dde4f5] leading-relaxed">
                  {note}
                </p>
              </div>
            ) : (
              /* 진행 중 — 아직 결과 없음 */
              <div className="flex flex-col items-center justify-center py-14 text-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#eef1fb] flex items-center justify-center text-3xl">
                  ⏳
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900 mb-1">집계 전입니다</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    제출 마감({formatDate(submissionDeadlineAt)}) 이후<br />
                    리더보드가 업데이트됩니다.
                  </p>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
                  {note}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
