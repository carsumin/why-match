// 쇼케이스 갤러리 페이지 — 수상작 아카이브

import { TagBadge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

// 더미 수상작 데이터
const showcaseItems = [
  {
    id: 'sc-001',
    teamName: '팀 루나틱',
    projectName: 'MediAI',
    description: 'LLM 기반 의료 상담 AI. 증상 입력 시 예상 진단과 가까운 병원을 추천합니다.',
    award: '대상',
    hackathon: 'AI 이노베이션 해커톤 2025',
    tags: ['AI', 'LLM', 'React', 'Python'],
    prize: '2,000만원',
  },
  {
    id: 'sc-002',
    teamName: '코드버스터즈',
    projectName: 'EduBot',
    description: '개인화 AI 튜터 서비스. 학습 패턴을 분석해 맞춤 커리큘럼을 제공합니다.',
    award: '최우수상',
    hackathon: 'AI 이노베이션 해커톤 2025',
    tags: ['AI', 'React', 'Node.js', 'TypeScript'],
    prize: '1,000만원',
  },
  {
    id: 'sc-003',
    teamName: '디자인 씽커스',
    projectName: 'CareTouch',
    description: '노인을 위한 직관적인 스마트홈 앱. 큰 버튼과 음성 인터페이스로 접근성을 극대화했습니다.',
    award: '대상',
    hackathon: 'UX 디자인 스프린트 2025',
    tags: ['Figma', 'UX', 'React', 'Prototyping'],
    prize: '500만원',
  },
];

const awardColor: Record<string, string> = {
  대상: 'bg-yellow-50 text-yellow-600',
  최우수상: 'bg-white text-gray-600',
  우수상: 'bg-orange-50 text-orange-600',
};

export default function ShowcasePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">쇼케이스 갤러리</h1>
      <p className="text-gray-500 mb-8">WhyMatch에서 탄생한 수상작들을 만나보세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {showcaseItems.map((item) => (
          <Card key={item.id} className="flex flex-col gap-3">
            {/* 수상 뱃지 */}
            <span className={`self-start text-xs font-bold px-2.5 py-0.5 rounded-full ${awardColor[item.award] ?? 'bg-sky-50 text-gray-700'}`}>
              {item.award}
            </span>

            {/* 프로젝트명 */}
            <div>
              <h2 className="font-extrabold text-gray-900 text-lg">{item.projectName}</h2>
              <p className="text-xs text-gray-400">by {item.teamName} · {item.hackathon}</p>
            </div>

            {/* 설명 */}
            <p className="text-sm text-gray-600 flex-1">{item.description}</p>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag) => (
                <TagBadge key={tag} label={tag} />
              ))}
            </div>

            {/* 상금 */}
            <p className="text-sm font-semibold text-gray-700">{item.prize}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
