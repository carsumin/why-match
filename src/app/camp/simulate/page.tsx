// 팀 빌딩 시뮬레이터 페이지
// - 합류자 모드: 내가 팀에 들어가면 어떻게 되는지 확인 → 연락하기
// - 팀장 모드: 내 팀에 후보자를 넣어보고 → 연락하기
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { teams, users } from '@/data/teams';
import { simulateTeamScore, calculateMatchScore } from '@/utils/matching';
import { TagBadge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useMessageContext } from '@/context/MessageContext';
import type { User } from '@/types';

type Mode = 'joiner' | 'leader';

const roleLabel: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  designer: '디자이너',
  pm: 'PM',
  data: '데이터',
  devops: 'DevOps',
};

export default function SimulatePage() {
  return (
    <Suspense>
      <SimulateContent />
    </Suspense>
  );
}

function SimulateContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'leader' ? 'leader' : 'joiner';
  const [mode, setMode] = useState<Mode>(initialMode);

  // 헤더에서 선택한 현재 로그인 유저
  const { currentUser: me } = useCurrentUser();
  // 메시지함에서 수락된 멤버 반영
  const { inbox } = useMessageContext();
  const acceptedMemberIds = inbox
    .filter((m) => m.status === 'accepted')
    .map((m) => m.fromUserId);

  // 합류자 모드: 내가 리더가 아닌 팀만
  const joinerTeams = me ? teams.filter((t) => t.leaderId !== me.id) : teams;

  const [joinerTeamId, setJoinerTeamId] = useState<string>(teams[0].id);

  // 팀장 모드: 내가 속한 팀 선택
  const [leaderTeamId, setLeaderTeamId] = useState<string>(teams[0].id);
  // 팀장 모드: 연락하기 모달
  const [contactCandidate, setContactCandidate] = useState<User | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [sentTo, setSentTo] = useState<string[]>([]);

  // me가 아직 결정되지 않은 경우 계산 스킵
  const joinerTeam = (joinerTeams.find((t) => t.id === joinerTeamId) ?? joinerTeams[0])!;
  const isMemberAlready = me ? joinerTeam.members.some((m) => m.id === me.id) : false;
  const joinerResult = me && !isMemberAlready ? simulateTeamScore(joinerTeam, me) : null;

  // ──────────────────────────────
  // 팀장 모드 계산 — 내가 리더인 팀만
  // ──────────────────────────────
  const myTeams = me ? teams.filter((t) => t.leaderId === me.id) : [];
  const baseLeaderTeam = myTeams.find((t) => t.id === leaderTeamId) ?? myTeams[0];

  // 수락된 멤버를 팀에 합산
  const leaderTeam = baseLeaderTeam ? (() => {
    const newMembers = acceptedMemberIds
      .filter((id) => !baseLeaderTeam.members.some((m) => m.id === id))
      .map((id) => users.find((u) => u.id === id))
      .filter((u): u is NonNullable<typeof u> => u != null);
    return newMembers.length > 0
      ? { ...baseLeaderTeam, members: [...baseLeaderTeam.members, ...newMembers] }
      : baseLeaderTeam;
  })() : baseLeaderTeam;

  const memberIds = leaderTeam?.members.map((m) => m.id) ?? [];
  const [candidateFilter, setCandidateFilter] = useState<'all' | 'match'>('match');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 후보 풀 전체에서 존재하는 태그 목록
  const allCandidatePool = leaderTeam && me
    ? users.filter((u) => u.id !== me.id && !memberIds.includes(u.id))
    : [];
  const availableTags = [...new Set(allCandidatePool.flatMap((u) => u.tags))].sort();

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  const candidates = (() => {
    if (!leaderTeam || !me) return [];
    let filtered = allCandidatePool;
    if (candidateFilter === 'match') {
      filtered = filtered.filter((u) => u.roles.some((r) => leaderTeam.requiredRoles.includes(r)));
    }
    if (selectedTags.length > 0) {
      filtered = filtered.filter((u) => selectedTags.every((t) => u.tags.includes(t)));
    }
    // 적합도 점수 높은 순 정렬
    return [...filtered].sort((a, b) =>
      calculateMatchScore(b, leaderTeam).score - calculateMatchScore(a, leaderTeam).score
    );
  })();

  function sendContact() {
    if (!contactCandidate) return;
    setSentTo((prev) => [...prev, contactCandidate.id]);
    setContactCandidate(null);
    setContactMessage('');
  }

  if (!me) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-gray-400">
        <p className="text-4xl mb-3">👤</p>
        <p className="text-sm font-semibold text-gray-600 mb-1">로그인이 필요합니다</p>
        <p className="text-sm">우측 상단 아바타를 눌러 사용자를 선택하세요.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-1">팀 빌딩 시뮬레이터</h1>
      <p className="text-sm text-gray-500 mb-6">합류하거나 팀을 꾸리기 전에 점수를 먼저 확인하세요.</p>

      {/* 모드 토글 */}
      <div className="flex gap-1 p-1 rounded-xl glass mb-8 w-fit">
        <button
          onClick={() => setMode('joiner')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
            mode === 'joiner' ? 'bg-white text-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          👤 합류자 모드
        </button>
        <button
          onClick={() => setMode('leader')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-colors ${
            mode === 'leader' ? 'bg-white text-gray-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          👑 팀장 모드
        </button>
      </div>

      {/* 내 프로필 */}
      <Card className="mb-4">
        <div className="mb-2">
          <p className="text-xs font-semibold text-gray-400">내 프로필</p>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-full bg-sky-50 flex items-center justify-center text-gray-700 font-bold text-sm shrink-0">
            {me.name[0]}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{me.name}</p>
            <p className="text-xs text-gray-400">{me.roles.map((r) => roleLabel[r] ?? r).join(' · ')}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {me.tags.map((tag) => <TagBadge key={tag} label={tag} />)}
        </div>
      </Card>

      {/* ────────────────────────── */}
      {/* 합류자 모드 */}
      {/* ────────────────────────── */}
      {mode === 'joiner' && (
        <div className="space-y-4">
          <Card>
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              어떤 팀에 합류할까요?
            </label>
            <select
              className="w-full border border-sky-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={joinerTeamId}
              onChange={(e) => setJoinerTeamId(e.target.value)}
            >
              {joinerTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <div className="mt-2 flex flex-wrap gap-1">
              {joinerTeam.tags.map((tag) => <TagBadge key={tag} label={tag} />)}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              현재 {joinerTeam.members.length}명 · 모집:{' '}
              {joinerTeam.requiredRoles.map((r) => roleLabel[r] ?? r).join(', ') || '없음'}
            </p>
          </Card>

          {isMemberAlready ? (
            <Card>
              <p className="text-sm text-gray-500 text-center py-2">이미 이 팀의 멤버입니다.</p>
            </Card>
          ) : joinerResult ? (
            <>
              {/* 결과 카드 */}
              <Card className="bg-sky-50 border-sky-100">
                <h2 className="text-xs font-semibold text-gray-500 mb-4">
                  내가 <strong className="text-gray-700">{joinerTeam.name}</strong>에 합류하면?
                </h2>
                <div className="flex items-center justify-around gap-4 mb-4">
                  <ScoreBlock label="합류 전" score={joinerResult.beforeScore} color="text-gray-500" />
                  <div className="text-2xl text-gray-300">→</div>
                  <ScoreBlock label="합류 후" score={joinerResult.afterScore} color="text-gray-700" />
                  <DeltaBlock delta={joinerResult.delta} />
                </div>
                {/* 합류 전 점수 근거 — 현재 팀원 조합 */}
                <TeamCompositionBreakdown team={joinerTeam} />
                <div className="border-t border-sky-100 my-3" />
                <ReasonBadge user={me} team={joinerTeam} />
              </Card>

              {/* 연락하기 */}
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); }}
                className="block w-full text-center py-3 rounded-xl bg-sky-200 text-sky-800 font-bold text-sm hover:bg-sky-300 transition-colors"
              >
                이 팀에 합류 신청하기 →
              </a>
            </>
          ) : null}
        </div>
      )}

      {/* ────────────────────────── */}
      {/* 팀장 모드 */}
      {/* ────────────────────────── */}
      {mode === 'leader' && (
        <div className="space-y-4">
          {myTeams.length === 0 ? (
            /* 내 팀이 없는 경우 */
            <Card>
              <div className="flex flex-col items-center text-center py-6 gap-3">
                <p className="text-3xl">🏗️</p>
                <p className="text-sm font-semibold text-gray-900">아직 만든 팀이 없습니다</p>
                <p className="text-xs text-gray-400">
                  팀원 모집 페이지에서 팀을 먼저 등록하면<br />팀장 모드로 후보자를 탐색할 수 있습니다.
                </p>
                <a
                  href="/camp"
                  className="mt-1 px-4 py-2 rounded-xl bg-sky-100 text-gray-900 text-sm font-bold hover:bg-sky-100 transition-colors"
                >
                  팀 만들러 가기 →
                </a>
              </div>
            </Card>
          ) : (
            <>
          <Card>
            <label className="block text-xs font-semibold text-gray-400 mb-2">
              내 팀 선택
            </label>
            <select
              className="w-full border border-sky-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={leaderTeamId || myTeams[0]?.id}
              onChange={(e) => setLeaderTeamId(e.target.value)}
            >
              {myTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              현재 {leaderTeam.members.length}명 · 모집:{' '}
              {leaderTeam.requiredRoles.map((r) => roleLabel[r] ?? r).join(', ') || '없음'}
            </p>
          </Card>

          {/* 현재 팀 구성원 */}
          <Card>
            <p className="text-xs font-semibold text-gray-400 mb-3">
              현재 구성원 ({leaderTeam.members.length}명)
            </p>
            {leaderTeam.members.length === 0 ? (
              <p className="text-xs text-gray-400">아직 팀원이 없습니다.</p>
            ) : (
              <div className="space-y-2">
                {leaderTeam.members.map((member) => {
                  const match = calculateMatchScore(member, leaderTeam);
                  return (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center text-sky-800 font-bold text-xs shrink-0">
                        {member.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-800">{member.name}</span>
                        <span className="text-xs text-gray-400 ml-1.5">
                          {member.roles.map((r) => roleLabel[r] ?? r).join(' · ')}
                        </span>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${
                        match.score >= 80 ? 'text-green-600' : match.score >= 60 ? 'text-yellow-600' : 'text-red-400'
                      }`}>
                        {match.score}점
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <div className="flex items-center justify-between px-1">
            <p className="text-sm font-semibold text-gray-900">
              후보자 목록 — 합류 시 팀 점수 변화
            </p>
            <div className="flex gap-1 p-0.5 rounded-lg bg-sky-50 text-xs">
              <button
                onClick={() => setCandidateFilter('match')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  candidateFilter === 'match' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                역할 매칭
              </button>
              <button
                onClick={() => setCandidateFilter('all')}
                className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                  candidateFilter === 'all' ? 'bg-white text-sky-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                전체
              </button>
            </div>
          </div>

          {/* 기술 태그 필터 */}
          {availableTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 px-1">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-sky-400 text-white'
                      : 'bg-sky-50 text-gray-500 hover:bg-sky-100'
                  }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-400 hover:text-gray-600 underline"
                >
                  초기화
                </button>
              )}
            </div>
          )}

          {candidates.length === 0 ? (
            <Card>
              <p className="text-sm text-gray-400 text-center py-4">검토할 후보자가 없습니다.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {candidates.map((candidate) => {
                const sim = simulateTeamScore(leaderTeam, candidate);
                const match = calculateMatchScore(candidate, leaderTeam);
                const alreadySent = sentTo.includes(candidate.id);
                return (
                  <Card key={candidate.id}>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{candidate.name}</p>
                        <p className="text-xs text-gray-400">
                          {candidate.roles.map((r) => roleLabel[r] ?? r).join(' · ')}
                          {' · '}{candidate.activeHours}h/day
                        </p>
                      </div>
                      {/* 합류 시 delta */}
                      <DeltaBlock delta={sim.delta} compact />
                    </div>

                    {/* 기술 태그 */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {candidate.tags.map((tag) => <TagBadge key={tag} label={tag} />)}
                    </div>

                    {/* before → after */}
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                      <span>팀 점수</span>
                      <span className="font-bold text-gray-600">{sim.beforeScore}</span>
                      <span>→</span>
                      <span className="font-bold text-gray-700">{sim.afterScore}</span>
                      <span className="ml-1 text-gray-400">· {match.reason}</span>
                    </div>

                    {/* 연락하기 */}
                    {alreadySent ? (
                      <p className="text-xs text-green-700 font-semibold text-center py-1">
                        ✓ 연락 완료
                      </p>
                    ) : (
                      <button
                        onClick={() => {
                          setContactCandidate(candidate);
                          setContactMessage('');
                        }}
                        className="w-full py-2 rounded-xl bg-sky-100 text-gray-900 text-sm font-bold hover:bg-sky-100 transition-colors"
                      >
                        연락하기
                      </button>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
            </>
          )}
        </div>
      )}

      {/* 연락하기 모달 (팀장 모드) */}
      {contactCandidate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md glass rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">
                {contactCandidate.name}님께 연락하기
              </h2>
              <button
                onClick={() => setContactCandidate(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="p-3 rounded-xl bg-sky-50 text-xs text-gray-500">
              <p className="font-semibold text-gray-900 mb-1">{contactCandidate.name}</p>
              <p>{contactCandidate.roles.map((r) => roleLabel[r] ?? r).join(', ')}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {contactCandidate.tags.map((t) => <TagBadge key={t} label={t} />)}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">메시지</label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                placeholder={`안녕하세요! 저희 팀 ${leaderTeam.name}에 합류해주실 수 있으실까요?`}
                rows={4}
                className="w-full px-3 py-2 rounded-xl border border-sky-100 text-sm focus:outline-none focus:border-gray-400 resize-none"
              />
            </div>
            <button
              onClick={sendContact}
              className="w-full py-3 rounded-xl bg-sky-100 text-gray-900 font-bold text-sm hover:bg-sky-100 transition-colors"
            >
              전송하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────
// 서브 컴포넌트
// ──────────────────────────────

function ScoreBlock({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-extrabold ${color}`}>{score}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}

function DeltaBlock({ delta, compact = false }: { delta: number; compact?: boolean }) {
  const color = delta > 0 ? 'text-green-700' : delta < 0 ? 'text-red-500' : 'text-gray-400';
  const sign = delta > 0 ? '+' : '';
  if (compact) {
    return (
      <span className={`text-sm font-extrabold ${color}`}>
        {sign}{delta}
      </span>
    );
  }
  return (
    <div className={`text-center ${color}`}>
      <div className="text-2xl font-extrabold">{sign}{delta}</div>
      <div className="text-xs">점수 변화</div>
    </div>
  );
}

function ReasonBadge({ user, team }: { user: User; team: (typeof teams)[number] }) {
  const match = calculateMatchScore(user, team);
  return (
    <div className="text-xs text-gray-700 glass px-3 py-1.5 rounded-full inline-block">
      💡 {match.reason}
    </div>
  );
}

/** 합류 전 점수 근거 — 현재 팀원별 매칭 점수 표시 */
function TeamCompositionBreakdown({ team }: { team: (typeof teams)[number] }) {
  if (team.members.length === 0) {
    return <p className="text-xs text-gray-400">현재 팀원이 없습니다.</p>;
  }

  const memberScores = team.members.map((member) => {
    const match = calculateMatchScore(member, team);
    return { member, match };
  });

  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 mb-2">
        현재 팀원 구성 ({team.members.length}명 평균)
      </p>
      <div className="space-y-1.5">
        {memberScores.map(({ member, match }) => (
          <div key={member.id} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full glass border border-sky-100 flex items-center justify-center text-gray-600 font-bold text-xs shrink-0">
              {member.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-gray-900">{member.name}</span>
              <span className="text-xs text-gray-400 ml-1">
                {member.roles.map((r) => roleLabel[r] ?? r).join('/')}
              </span>
            </div>
            <span className={`text-xs font-bold shrink-0 ${
              match.score >= 80 ? 'text-green-700' : match.score >= 60 ? 'text-yellow-600' : 'text-red-400'
            }`}>
              {match.score}점
            </span>
            <span className="text-xs text-gray-400 shrink-0 truncate max-w-30">
              {match.reason}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
