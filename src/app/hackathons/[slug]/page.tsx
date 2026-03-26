// 해커톤 상세 페이지 (7개 탭)

import { notFound } from 'next/navigation';
import { getHackathonBySlug } from '@/data/hackathons';
import { getTeamsByHackathon } from '@/data/teams';
import { DdayBadge, TagBadge } from '@/components/ui/Badge';

const tabs = ['개요', '평가', '일정', '상금', '팀', '제출', '리더보드'] as const;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function HackathonDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab = '개요' } = await searchParams;

  const hackathon = getHackathonBySlug(slug);
  if (!hackathon) notFound();

  const teams = getTeamsByHackathon(hackathon.id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* 헤더 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <TagBadge label={hackathon.organizer} />
          <DdayBadge deadline={hackathon.deadline} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800">{hackathon.title}</h1>
        <p className="mt-2 text-gray-500">{hackathon.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {hackathon.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex gap-1 border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <a
            key={t}
            href={`?tab=${t}`}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              tab === t
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </a>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        {tab === '개요' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">대회 개요</h2>
            <p className="text-gray-600">{hackathon.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <InfoBlock label="팀 규모" value={`${hackathon.minTeamSize}~${hackathon.maxTeamSize}명`} />
              <InfoBlock label="총 상금" value={hackathon.prize} />
              <InfoBlock label="시작일" value={new Date(hackathon.startDate).toLocaleDateString('ko-KR')} />
              <InfoBlock label="종료일" value={new Date(hackathon.endDate).toLocaleDateString('ko-KR')} />
            </div>
          </div>
        )}
        {tab === '팀' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">참가 팀 ({teams.length}팀)</h2>
            {teams.length === 0 ? (
              <p className="text-gray-400">아직 등록된 팀이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {teams.map((team) => (
                  <li key={team.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="font-semibold text-gray-800">{team.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{team.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {team.tags.map((tag) => <TagBadge key={tag} label={tag} />)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {tab !== '개요' && tab !== '팀' && (
          <p className="text-gray-400 text-sm">"{tab}" 탭 콘텐츠는 준비 중입니다.</p>
        )}
      </div>
    </div>
  );
}

// 정보 블록 서브 컴포넌트
function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-indigo-50 text-center">
      <p className="text-xs text-indigo-400 mb-1">{label}</p>
      <p className="font-bold text-indigo-700 text-sm">{value}</p>
    </div>
  );
}
