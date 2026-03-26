// 해커톤 목록 페이지

import Link from 'next/link';
import { hackathons } from '@/data/hackathons';
import { DdayBadge, TagBadge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

const statusLabel: Record<string, string> = {
  upcoming: '모집 예정',
  ongoing: '진행 중',
  ended: '종료',
};

const statusColor: Record<string, string> = {
  upcoming: 'text-blue-600 bg-blue-50',
  ongoing: 'text-green-600 bg-green-50',
  ended: 'text-gray-400 bg-gray-100',
};

export default function HackathonsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">해커톤 목록</h1>
      <p className="text-gray-500 mb-8">참가할 해커톤을 찾고 팀을 구성해보세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {hackathons.map((hackathon) => (
          <Link key={hackathon.id} href={`/hackathons/${hackathon.slug}`}>
            <Card className="h-full flex flex-col gap-3 hover:border-indigo-200 transition-colors">
              {/* 상태 + D-day */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[hackathon.status]}`}>
                  {statusLabel[hackathon.status]}
                </span>
                <DdayBadge deadline={hackathon.deadline} />
              </div>

              {/* 제목 */}
              <h2 className="font-bold text-gray-800 leading-snug">{hackathon.title}</h2>

              {/* 주최 */}
              <p className="text-xs text-gray-400">{hackathon.organizer}</p>

              {/* 설명 */}
              <p className="text-sm text-gray-600 line-clamp-2 flex-1">{hackathon.description}</p>

              {/* 태그 */}
              <div className="flex flex-wrap gap-1">
                {hackathon.tags.slice(0, 4).map((tag) => (
                  <TagBadge key={tag} label={tag} />
                ))}
              </div>

              {/* 상금 */}
              <div className="text-sm font-semibold text-indigo-600">
                총 상금 {hackathon.prize}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
