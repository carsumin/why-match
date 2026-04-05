'use client';

// 수상작 상세 모달

import { useEffect } from 'react';
import Link from 'next/link';
import { TagBadge } from '@/components/ui/Badge';

export interface ShowcaseItem {
  id: string;
  teamName: string;
  projectName: string;
  description: string;
  award: string;
  hackathon: string;
  tags: string[];
  prize: string;
  highlights: string[];
  members: { role: string; count: number }[];
  demoUrl?: string;
  githubUrl?: string;
}

interface ShowcaseDetailModalProps {
  item: ShowcaseItem;
  awardColor: string;
  onClose: () => void;
}

export default function ShowcaseDetailModal({ item, awardColor, onClose }: ShowcaseDetailModalProps) {
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

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center">
        <div
          className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col w-full md:max-w-lg md:mx-4"
          style={{ maxHeight: '88dvh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 드래그 핸들 (모바일) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* 헤더 */}
          <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-4 border-b border-gray-100">
            <div className="flex-1 min-w-0">
              <span className={`inline-block text-xs font-bold px-2.5 py-0.5 rounded-full mb-2 ${awardColor}`}>
                {item.award}
              </span>
              <h2 className="text-lg font-extrabold text-gray-900 leading-tight">{item.projectName}</h2>
              <p className="text-xs text-gray-400 mt-0.5">by {item.teamName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* 본문 */}
          <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
            {/* 해커톤 + 상금 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                <p className="text-xs text-gray-400 mb-1">참가 해커톤</p>
                <p className="text-sm font-bold text-gray-900 leading-snug">{item.hackathon}</p>
              </div>
              <div className="p-4 rounded-2xl bg-yellow-50 border border-yellow-100">
                <p className="text-xs text-gray-400 mb-1">수상 상금</p>
                <p className="text-sm font-bold text-yellow-700">{item.prize}</p>
              </div>
            </div>

            {/* 프로젝트 소개 */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-1.5">프로젝트 소개</p>
              <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
            </div>

            {/* 주요 특징 */}
            {item.highlights.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">주요 특징</p>
                <ul className="space-y-2">
                  {item.highlights.map((h, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-sky-400 shrink-0 mt-0.5">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 팀 구성 */}
            {item.members.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">팀 구성</p>
                <div className="flex flex-wrap gap-2">
                  {item.members.map((m) => (
                    <span
                      key={m.role}
                      className="text-xs font-semibold px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-gray-700"
                    >
                      {m.role} {m.count > 1 ? `×${m.count}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 기술 스택 */}
            <div>
              <p className="text-xs font-semibold text-gray-400 mb-2">기술 스택</p>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} />
                ))}
              </div>
            </div>
          </div>

          {/* 링크 버튼 */}
          {(item.demoUrl || item.githubUrl) && (
            <div className="px-5 pb-6 pt-3 border-t border-gray-100 flex gap-3">
              {item.demoUrl && (
                <Link
                  href={item.demoUrl}
                  className="flex-1 text-center py-3 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
                >
                  🔗 데모 보기
                </Link>
              )}
              {item.githubUrl && (
                <a
                  href={item.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
