// 팀 빌딩 시뮬레이터 페이지
'use client';

import { useState } from 'react';
import { teams, users } from '@/data/teams';
import { simulateTeamScore } from '@/utils/matching';
import { TagBadge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function SimulatePage() {
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0].id);
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0].id);

  const selectedTeam = teams.find((t) => t.id === selectedTeamId)!;
  const selectedUser = users.find((u) => u.id === selectedUserId)!;

  // 이미 팀원인 유저는 제외
  const memberIds = selectedTeam.members.map((m) => m.id);
  const availableUsers = users.filter((u) => !memberIds.includes(u.id));

  const result = simulateTeamScore(selectedTeam, selectedUser);
  const deltaColor = result.delta > 0 ? 'text-green-600' : result.delta < 0 ? 'text-red-500' : 'text-gray-400';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">팀 빌딩 시뮬레이터</h1>
      <p className="text-gray-500 mb-8">
        팀에 새 멤버가 합류했을 때 팀 적합도 점수가 어떻게 변하는지 확인해보세요.
      </p>

      <div className="space-y-4">
        {/* 팀 선택 */}
        <Card>
          <label className="block text-sm font-semibold text-gray-700 mb-2">팀 선택</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-wrap gap-1">
            {selectedTeam.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            현재 {selectedTeam.members.length}명 · 모집 중:{' '}
            {selectedTeam.requiredRoles.join(', ') || '없음'}
          </p>
        </Card>

        {/* 합류 유저 선택 */}
        <Card>
          <label className="block text-sm font-semibold text-gray-700 mb-2">합류할 유저 선택</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} — {user.roles.join(', ')}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-wrap gap-1">
            {selectedUser.tags.map((tag) => (
              <TagBadge key={tag} label={tag} />
            ))}
          </div>
        </Card>

        {/* 시뮬레이션 결과 */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">시뮬레이션 결과</h2>
          <div className="flex items-center justify-around gap-4">
            <ScoreBlock label="합류 전" score={result.beforeScore} color="text-gray-600" />
            <div className="text-2xl text-gray-300 font-light">→</div>
            <ScoreBlock label="합류 후" score={result.afterScore} color="text-indigo-600" />
            <div className={`text-center ${deltaColor}`}>
              <div className="text-2xl font-extrabold">
                {result.delta > 0 ? '+' : ''}{result.delta}
              </div>
              <div className="text-xs">점수 변화</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ScoreBlock({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-3xl font-extrabold ${color}`}>{score}</div>
      <div className="text-xs text-gray-400 mt-1">{label}</div>
    </div>
  );
}
