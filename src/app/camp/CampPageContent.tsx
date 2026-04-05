'use client';

// 팀원 모집 실제 콘텐츠 — useSearchParams 사용

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { hackathonList } from '@/data/hackathons';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useTeamDb } from '@/hooks/useTeamDb';
import type { TeamRecord } from '@/hooks/useTeamDb';
import ContactModal from '@/components/messages/ContactModal';

const POSITIONS = ['Frontend', 'Backend', 'Designer', 'PM', 'Data', 'ML Engineer', 'DevOps'];

// 모듈 로드 시 1회 계산 (hackathonList.status는 이미 computeHackathonStatus 결과)
const activeHackathons = hackathonList.filter((h) => h.status !== 'ended');
const activeSlugSet = new Set(activeHackathons.map((h) => h.slug));

export default function CampPageContent() {
  const searchParams = useSearchParams();
  const { currentUser } = useCurrentUser();
  const { teams: dbTeams, createTeam } = useTeamDb();

  // 초기값: URL 쿼리 파라미터 우선
  const initialSlug = searchParams.get('hackathon');
  const [filterSlug, setFilterSlug] = useState<string | null>(initialSlug);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 새 팀 폼 상태
  const [form, setForm] = useState({
    name: '',
    intro: '',
    isOpen: true,
    lookingFor: [] as string[],
    contactUrl: '',
    hackathonSlug: filterSlug ?? '',
  });

  // 필터링 + 내 팀 상단 정렬 (종료된 해커톤 팀 제외)
  const filtered = useMemo(() => {
    const active = dbTeams.filter((t) => !t.hackathonSlug || activeSlugSet.has(t.hackathonSlug));
    const base = filterSlug
      ? active.filter((t) => t.hackathonSlug === filterSlug)
      : active;
    return [...base].sort((a, b) => {
      const aIsMe = a.leaderId === currentUser?.id ? -1 : 0;
      const bIsMe = b.leaderId === currentUser?.id ? 1 : 0;
      return aIsMe + bIsMe;
    });
  }, [dbTeams, filterSlug, currentUser]);

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
    createTeam({
      teamCode: `T-NEW-${Date.now()}`,
      hackathonSlug: form.hackathonSlug || null,
      leaderId: currentUser?.id ?? '',
      name: form.name.trim(),
      isOpen: form.isOpen,
      lookingFor: form.lookingFor,
      intro: form.intro.trim(),
      contact: { type: 'link', url: form.contactUrl.trim() || '#' },
      createdAt: new Date().toISOString(),
    });
    setIsModalOpen(false);
    setForm({ name: '', intro: '', isOpen: true, lookingFor: [], contactUrl: '', hackathonSlug: filterSlug ?? '' });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-extrabold text-gray-900">팀원 모집</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-1.5 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
        >
          + 팀 등록
        </button>
      </div>

      {/* 해커톤 필터 탭 */}
      <div className="flex gap-2 flex-wrap mb-5">
        <button
          onClick={() => setFilterSlug(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            filterSlug === null
              ? 'bg-gray-800 text-white'
              : 'bg-sky-50 text-gray-500 hover:bg-sky-100'
          }`}
        >
          전체
        </button>
        {activeHackathons.map((h) => {
          const status = h.status;
          const isActive = filterSlug === h.slug;
          return (
            <button
              key={h.slug}
              onClick={() => setFilterSlug(h.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-gray-800 text-white'
                  : 'bg-sky-50 text-gray-500 hover:bg-sky-100'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  status === 'ongoing' ? 'bg-green-400' : 'bg-yellow-400'
                }`}
              />
              {h.title.length > 18 ? h.title.slice(0, 18) + '…' : h.title}
            </button>
          );
        })}
      </div>

      {/* 팀 카드 목록 */}
      {filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((team) => (
            <TeamCard
              key={team.teamCode}
              team={team}
              isMyTeam={team.leaderId === currentUser?.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm font-semibold text-gray-600 mb-1">등록된 팀이 없습니다</p>
          <p className="text-sm mb-4">
            {filterSlug ? '이 해커톤에 아직 팀이 없습니다.' : '아직 팀이 없습니다.'}
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

            {/* 해커톤 선택 */}
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                해커톤 <span className="text-red-400">*</span>
              </label>
              <select
                value={form.hackathonSlug}
                onChange={(e) => setForm((p) => ({ ...p, hackathonSlug: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-sky-100 text-sm focus:outline-none focus:border-gray-400 bg-white"
              >
                <option value="">해커톤을 선택하세요</option>
                {activeHackathons.map((h) => (
                  <option key={h.slug} value={h.slug}>
                    {h.title}
                  </option>
                ))}
              </select>
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
              disabled={!form.name.trim() || !form.intro.trim() || !form.hackathonSlug}
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
function TeamCard({ team, isMyTeam }: { team: TeamRecord; isMyTeam: boolean }) {
  const [contactOpen, setContactOpen] = useState(false);
  return (
    <div className={`rounded-2xl shadow-sm p-5 space-y-3 ${
      isMyTeam
        ? 'bg-sky-50 border-2 border-sky-300'
        : 'glass border border-sky-100'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {isMyTeam && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-300 text-sky-900">
                내 팀
              </span>
            )}
            <h2 className="font-bold text-gray-900">{team.name}</h2>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                team.isOpen ? 'bg-green-50 text-green-700' : 'bg-white text-gray-500'
              }`}
            >
              {team.isOpen ? '모집중' : '마감'}
            </span>
          </div>
          <p className="text-xs text-gray-400">현재 {team.memberIds.length}명</p>
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
        {isMyTeam ? (
          /* 내 팀: 시뮬레이션 없음 → 팀장 모드 바로가기 + 지원자 확인 */
          <>
            <Link
              href="/camp/simulate?mode=leader"
              className="flex-1 text-center py-2 rounded-xl border border-sky-300 text-sky-700 text-sm font-semibold hover:bg-sky-100 transition-colors"
            >
              팀장 모드 →
            </Link>
            <Link
              href="/messages"
              className="flex-1 text-center py-2 rounded-xl bg-sky-300 text-sky-900 text-sm font-bold hover:bg-sky-400 transition-colors"
            >
              지원자 확인
            </Link>
          </>
        ) : (
          /* 남의 팀: 시뮬레이션 + 연락하기 */
          <>
            <Link
              href={`/camp/simulate?team=${team.teamCode}`}
              className="flex-1 text-center py-2 rounded-xl bg-pink-100 text-pink-700 text-sm font-bold hover:bg-pink-200 transition-colors"
            >
              내 궁합 보기 ✦
            </Link>
            {team.isOpen ? (
              <button
                onClick={() => setContactOpen(true)}
                className="flex-1 text-center py-2 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
              >
                연락하기 →
              </button>
            ) : (
              <button
                disabled
                className="flex-1 py-2 rounded-xl glass text-gray-400 text-sm font-semibold cursor-not-allowed"
              >
                모집 마감
              </button>
            )}
          </>
        )}
      </div>

      {contactOpen && (
        <ContactModal team={team} onClose={() => setContactOpen(false)} />
      )}
    </div>
  );
}
