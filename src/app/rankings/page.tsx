// 랭킹 보드 페이지

import { TagBadge } from '@/components/ui/Badge';

// 더미 랭킹 데이터
const rankings = [
  { rank: 1, teamName: '팀 루나틱', hackathon: 'AI 이노베이션 해커톤 2025', award: '대상', prize: '2,000만원', tags: ['AI', 'LLM', 'React'] },
  { rank: 2, teamName: '코드버스터즈', hackathon: 'AI 이노베이션 해커톤 2025', award: '최우수상', prize: '1,000만원', tags: ['React', 'Node.js', 'AI'] },
  { rank: 3, teamName: '데이터 드리머스', hackathon: 'AI 이노베이션 해커톤 2025', award: '우수상', prize: '500만원', tags: ['Python', 'ML', 'SQL'] },
  { rank: 4, teamName: '디자인 씽커스', hackathon: 'UX 디자인 스프린트 2025', award: '대상', prize: '500만원', tags: ['Figma', 'UX', 'React'] },
];

const rankEmoji: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function RankingsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-2">랭킹 보드</h1>
      <p className="text-gray-500 mb-8">해커톤 수상팀 기록을 확인하세요.</p>

      {/* 필터 (placeholder) */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['전체', '이번 달', '올해'].map((filter) => (
          <button
            key={filter}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === '전체'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {rankings.map((entry) => (
          <div
            key={entry.rank}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100"
          >
            {/* 순위 */}
            <div className="w-10 text-center text-xl font-extrabold text-gray-300">
              {rankEmoji[entry.rank] ?? entry.rank}
            </div>

            {/* 팀 정보 */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800">{entry.teamName}</p>
              <p className="text-xs text-gray-400 truncate">{entry.hackathon}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {entry.tags.map((tag) => (
                  <TagBadge key={tag} label={tag} />
                ))}
              </div>
            </div>

            {/* 수상 */}
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-indigo-600">{entry.award}</p>
              <p className="text-xs text-gray-400">{entry.prize}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
