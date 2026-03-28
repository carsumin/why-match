'use client';

// 팀원 모집 실제 콘텐츠 — useSearchParams 사용

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { campTeams as initialTeams } from '@/data/teams';
import { hackathonList } from '@/data/hackathons';
import type { CampTeam } from '@/types';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'Data', 'ML Engineer', 'DevOps'];

export default function CampPageContent() {
  const searchParams = useSearchParams();
  const hackathonSlug = searchParams.get('hackathon');

  const [teams, setTeams] = useState<CampTeam[]>(initialTeams);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 새 팀 폼 상태
  const [form, setForm] = useState({
    name: '',
    intro: '',
    isOpen: true,
    lookingFor: [] as string[],
    contactUrl: '',
  });

  // hackathon 쿼리 파라미터로 필터링
  const filtered = useMemo(() => {
    if (!hackathonSlug) return teams;
    return teams.filter((t) => t.hackathonSlug === hackathonSlug);
  }, [teams, hackathonSlug]);

  // 현재 필터링 중인 해커톤 정보
  const currentHackathon = hackathonSlug
    ? hackathonList.find((h) => h.slug === hackathonSlug)
    : null;

  function togglePosition(pos: string) {
    setForm((prev) => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(pos)
        ? prev.lookingFor.filter((p) => p !== pos)
        : [...prev.lookingFor, pos],
    }));
  }

  function submitForm() {
    if (!form.name.trim() || !form.intro.trim()) return;
    const newTeam: CampTeam = {
      teamCode: `T-NEW-${Date.now()}`,
      hackathonSlug: hackathonSlug,
      name: form.name.trim(),
      isOpen: form.isOpen,
      memberCount: 1,
      lookingFor: form.lookingFor,
      intro: form.intro.trim(),
      contact: { type: 'link', url: form.contactUrl.trim() || '#' },
      createdAt: new Date().toISOString(),
    };
    setTeams((prev) => [newTeam, ...prev]);
    setIsModalOpen(false);
    setForm({ name: '', intro: '', isOpen: true, lookingFor: [], contactUrl: '' });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-extrabold text-gray-900">팀원 모집</h1>
        <div className="flex gap-2">
          <Link
            href="/camp/simulate"
            className="text-sm text-gray-600 font-medium hover:underline"
          >
            시뮬레이터 →
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
          >
            + 팀 등록
          </button>
        </div>
      </div>

      {/* 필터 안내 */}
      {currentHackathon ? (
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">
            <strong className="text-gray-700">{currentHackathon.title}</strong> 참가 팀만 보기
          </span>
          <Link href="/camp" className="text-xs text-gray-400 hover:text-gray-600 underline">
            전체 보기
          </Link>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-6">팀에 합류하거나 새 팀을 등록해보세요.</p>
      )}

      {/* 팀 카드 목록 */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((team) => (
            <TeamCard key={team.teamCode} team={team} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm font-semibold text-gray-600 mb-1">등록된 팀이 없습니다</p>
          <p className="text-sm mb-4">
            {hackathonSlug ? '이 해커톤에 아직 팀이 없습니다.' : '아직 팀이 없습니다.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
          >
            첫 번째 팀 등록하기
          </button>
        </div>
      )}

      {/* 팀 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md glass rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">팀 모집글 등록</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {/* 팀명 */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                팀명 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="예: 404found"
                className="w-full px-3 py-2 rounded-xl border border-sky-100 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* 소개 */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                소개 <span className="text-red-400">*</span>
              </label>
              <textarea
                value={form.intro}
                onChange={(e) => setForm((p) => ({ ...p, intro: e.target.value }))}
                placeholder="팀 소개와 목표를 간략히 적어주세요"
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-sky-100 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>

            {/* 모집 중 여부 */}
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-500">모집 상태</label>
              <button
                onClick={() => setForm((p) => ({ ...p, isOpen: !p.isOpen }))}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                  form.isOpen
                    ? 'bg-green-50 text-green-700'
                    : 'bg-white text-gray-500'
                }`}
              >
                {form.isOpen ? '모집중' : '마감'}
              </button>
            </div>

            {/* 모집 포지션 */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-2">모집 포지션</label>
              <div className="flex flex-wrap gap-2">
                {POSITIONS.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => togglePosition(pos)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      form.lookingFor.includes(pos)
                        ? 'bg-sky-100 text-gray-900'
                        : 'bg-sky-50 text-gray-600 hover:bg-sky-50'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* 연락 링크 */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">연락 링크</label>
              <input
                type="url"
                value={form.contactUrl}
                onChange={(e) => setForm((p) => ({ ...p, contactUrl: e.target.value }))}
                placeholder="카카오톡 오픈채팅 또는 구글폼 URL"
                className="w-full px-3 py-2 rounded-xl border border-sky-100 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* 제출 버튼 */}
            <button
              onClick={submitForm}
              disabled={!form.name.trim() || !form.intro.trim()}
              className="w-full py-3 rounded-xl bg-sky-200 text-sky-800 font-bold text-sm hover:bg-sky-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              등록하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 팀 카드 컴포넌트
function TeamCard({ team }: { team: CampTeam }) {
  return (
    <div className="glass rounded-2xl border border-sky-100 shadow-sm p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-bold text-gray-900">{team.name}</h2>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                team.isOpen ? 'bg-green-50 text-green-700' : 'bg-white text-gray-500'
              }`}
            >
              {team.isOpen ? '모집중' : '마감'}
            </span>
          </div>
          <p className="text-xs text-gray-400">현재 {team.memberCount}명</p>
        </div>
      </div>

      {/* 소개 */}
      <p className="text-sm text-gray-600">{team.intro}</p>

      {/* 모집 포지션 */}
      {team.lookingFor.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400">모집:</span>
          {team.lookingFor.map((pos) => (
            <span
              key={pos}
              className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-50 text-gray-600"
            >
              {pos}
            </span>
          ))}
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-2 pt-1">
        <Link
          href="/camp/simulate"
          className="flex-1 text-center py-2 rounded-xl border border-sky-100 text-gray-600 text-sm font-semibold hover:bg-sky-50 transition-colors"
        >
          시뮬레이션 해보기
        </Link>
        {team.isOpen ? (
          <a
            href={team.contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center py-2 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
          >
            연락하기 →
          </a>
        ) : (
          <button
            disabled
            className="flex-1 py-2 rounded-xl glass text-gray-400 text-sm font-semibold cursor-not-allowed"
          >
            모집 마감
          </button>
        )}
      </div>
    </div>
  );
}
