// 팀원 모집 페이지 — 스와이프 탐색 (placeholder)

import { teams } from '@/data/teams';
import { TagBadge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Link from 'next/link';

const roleLabel: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  designer: '디자이너',
  pm: 'PM',
  data: '데이터',
  devops: 'DevOps',
};

export default function CampPage() {
  // 팀 모집 중인 팀만 표시 (requiredRoles가 있는 팀)
  const recruitingTeams = teams.filter((t) => t.requiredRoles.length > 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-extrabold text-gray-800">팀원 모집</h1>
        <Link
          href="/camp/simulate"
          className="text-sm text-indigo-600 font-medium hover:underline"
        >
          팀 시뮬레이터 →
        </Link>
      </div>
      <p className="text-gray-500 mb-8">
        스와이프로 팀을 탐색하고 적합도 점수를 확인하세요.
        <br />
        <span className="text-xs text-gray-400">(스와이프 UI는 다음 단계에서 구현됩니다)</span>
      </p>

      {/* 팀 카드 목록 */}
      <div className="space-y-4">
        {recruitingTeams.map((team) => (
          <Card key={team.id} className="flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-gray-800">{team.name}</h2>
                <p className="text-xs text-gray-400">
                  활동 시간 {team.activeHoursMin}~{team.activeHoursMax}h/day
                </p>
              </div>
              {/* 매칭 점수 placeholder */}
              <div className="flex flex-col items-end">
                <span className="text-2xl font-extrabold text-indigo-600">--</span>
                <span className="text-xs text-gray-400">매칭 점수</span>
              </div>
            </div>

            {team.description && (
              <p className="text-sm text-gray-600">{team.description}</p>
            )}

            {/* 필요 역할 */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400">모집 역할:</span>
              {team.requiredRoles.map((role) => (
                <span
                  key={role}
                  className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
                >
                  {roleLabel[role] ?? role}
                </span>
              ))}
            </div>

            {/* 기술 태그 */}
            <div className="flex flex-wrap gap-1">
              {team.tags.map((tag) => (
                <TagBadge key={tag} label={tag} />
              ))}
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2 mt-1">
              <button className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-400 text-sm hover:border-red-300 hover:text-red-400 transition-colors">
                패스
              </button>
              <button className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                지원하기
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
