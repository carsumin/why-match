// 유저 프로필 페이지

import { getUserById, users } from '@/data/teams';
import { notFound } from 'next/navigation';
import { TagBadge } from '@/components/ui/Badge';

const roleLabel: Record<string, string> = {
  frontend: '프론트엔드',
  backend: '백엔드',
  designer: '디자이너',
  pm: 'PM',
  data: '데이터',
  devops: 'DevOps',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;

  // 'me'는 첫 번째 유저로 처리 (로그인 기능 없음)
  const user = id === 'me' ? users[0] : getUserById(id);
  if (!user) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* 프로필 헤더 */}
      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-extrabold">
          {user.name[0]}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">{user.name}</h1>
          <div className="flex flex-wrap gap-1 mt-1">
            {user.roles.map((role) => (
              <span
                key={role}
                className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700"
              >
                {roleLabel[role] ?? role}
              </span>
            ))}
          </div>
          {user.bio && <p className="text-sm text-gray-500 mt-2">{user.bio}</p>}
        </div>
      </div>

      {/* 기술 스택 */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">기술 스택</h2>
        <div className="flex flex-wrap gap-2">
          {user.tags.map((tag) => (
            <TagBadge key={tag} label={tag} className="text-sm px-3 py-1" />
          ))}
        </div>
      </section>

      {/* 활동 시간 */}
      <section className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">활동 정보</h2>
        <div className="p-4 bg-white rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">하루 평균 활동 시간</span>
            <span className="font-bold text-indigo-600">{user.activeHours}h/day</span>
          </div>
        </div>
      </section>

      {/* 링크 */}
      {(user.githubUrl || user.portfolioUrl) && (
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">포트폴리오</h2>
          <div className="flex flex-wrap gap-3">
            {user.githubUrl && (
              <a
                href={user.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-indigo-300 transition-colors"
              >
                GitHub
              </a>
            )}
            {user.portfolioUrl && (
              <a
                href={user.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-indigo-300 transition-colors"
              >
                포트폴리오
              </a>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
