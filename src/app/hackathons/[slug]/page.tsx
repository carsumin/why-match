// 해커톤 상세 페이지 — 7개 탭 (개요·평가·일정·상금·팀·제출·리더보드)

import { notFound } from 'next/navigation';
import { getHackathonListItem, getHackathonDetail } from '@/data/hackathons';
import { getLeaderboard } from '@/data/leaderboards';
import { DdayBadge, TagBadge } from '@/components/ui/Badge';
import HackathonTabs from '@/components/hackathon/HackathonTabs';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function HackathonDetailPage({ params }: Props) {
  const { slug } = await params;

  const listItem = getHackathonListItem(slug);
  const detail = getHackathonDetail(slug);

  // 데이터 없으면 404
  if (!listItem || !detail) notFound();

  const leaderboard = getLeaderboard(slug);

  const statusLabel: Record<string, string> = {
    ongoing: '진행중',
    ended: '종료',
    upcoming: '예정',
  };
  const statusColor: Record<string, string> = {
    ongoing: 'bg-green-50 text-green-700',
    ended: 'bg-white text-gray-500',
    upcoming: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColor[listItem.status]}`}
          >
            {statusLabel[listItem.status]}
          </span>
          {listItem.status !== 'ended' && (
            <DdayBadge deadline={listItem.period.submissionDeadlineAt} />
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 leading-snug mb-3">
          {listItem.title}
        </h1>

        <div className="flex flex-wrap gap-1">
          {listItem.tags.map((tag) => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
      </div>

      {/* 탭 + 콘텐츠 */}
      <HackathonTabs
        detail={detail}
        submissionDeadlineAt={listItem.period.submissionDeadlineAt}
        leaderboard={leaderboard}
      />
    </div>
  );
}
