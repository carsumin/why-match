'use client';

// 쇼케이스 갤러리 페이지 — 수상작 아카이브

import { useState } from 'react';
import { TagBadge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import ShowcaseDetailModal from '@/components/showcase/ShowcaseDetailModal';
import type { ShowcaseItem } from '@/components/showcase/ShowcaseDetailModal';

const showcaseItems: ShowcaseItem[] = [
  {
    id: 'sc-001',
    teamName: '팀 루나틱',
    projectName: 'MediAI',
    description: 'LLM 기반 의료 상담 AI. 증상을 텍스트로 입력하면 GPT-4o 기반 엔진이 예상 진단과 함께 가까운 병원·진료과를 추천합니다. 응급 상황 감지 시 119 연결 기능도 포함됩니다.',
    award: '대상',
    hackathon: 'AI 이노베이션 해커톤 2025',
    tags: ['AI', 'LLM', 'React', 'Python', 'FastAPI'],
    prize: '2,000만원',
    highlights: [
      'GPT-4o 기반 증상 분석 엔진으로 정확도 92% 달성',
      '현재 위치 기반 반경 3km 내 병원·약국 실시간 추천',
      '응급 키워드 감지 시 즉시 119 연결 UX 구현',
      '의료 용어를 일반 언어로 자동 번역하는 Easy-Explain 기능',
    ],
    members: [
      { role: 'Frontend', count: 2 },
      { role: 'Backend', count: 2 },
      { role: 'AI/ML', count: 1 },
    ],
    demoUrl: '/showcase/sc-001/demo',
    githubUrl: 'https://github.com/',
  },
  {
    id: 'sc-002',
    teamName: '코드버스터즈',
    projectName: 'EduBot',
    description: '개인화 AI 튜터 서비스. 학습 이력과 오답 패턴을 분석해 맞춤 커리큘럼과 문제를 자동 생성합니다. 현재 수학·코딩 과목을 지원하며 월 700명의 베타 사용자를 보유하고 있습니다.',
    award: '최우수상',
    hackathon: 'AI 이노베이션 해커톤 2025',
    tags: ['AI', 'React', 'Node.js', 'TypeScript', 'OpenAI'],
    prize: '1,000만원',
    highlights: [
      '학습 이력 기반 약점 자동 탐지 및 집중 문제 추천',
      '오답률 높은 개념을 3가지 다른 방식으로 재설명하는 Multi-Explain',
      '학부모 대시보드로 자녀의 학습 진도 실시간 확인',
      '베타 기간 평균 학습 시간 41% 증가 효과 측정',
    ],
    members: [
      { role: 'Frontend', count: 1 },
      { role: 'Backend', count: 2 },
      { role: 'AI/ML', count: 1 },
      { role: 'Designer', count: 1 },
    ],
    demoUrl: '/showcase/sc-002/demo',
    githubUrl: 'https://github.com/codebusters/edubot',
  },
  {
    id: 'sc-003',
    teamName: '디자인 씽커스',
    projectName: 'CareTouch',
    description: '노인을 위한 직관적인 스마트홈 앱. 최소 탭 수로 모든 기능에 접근할 수 있도록 설계하고, 음성 명령과 대형 UI로 접근성을 극대화했습니다. 고령자 10명 대상 사용성 테스트에서 만족도 4.8/5점을 기록했습니다.',
    award: '대상',
    hackathon: 'UX 디자인 스프린트 2025',
    tags: ['Figma', 'UX', 'React', 'Prototyping', 'Accessibility'],
    prize: '500만원',
    highlights: [
      '모든 기능을 최대 2번의 탭으로 접근 가능한 플랫 네비게이션 설계',
      '음성 명령으로 조명·난방·TV 제어 지원',
      '글자 크기·대비를 사용자가 직접 조절하는 개인화 설정',
      '고령자 10명 사용성 테스트 만족도 4.8 / 5점',
    ],
    members: [
      { role: 'UX Designer', count: 2 },
      { role: 'Frontend', count: 1 },
      { role: 'PM', count: 1 },
    ],
    demoUrl: '/showcase/sc-003/demo',
  },
];

const awardColor: Record<string, string> = {
  대상: 'bg-yellow-50 text-yellow-600',
  최우수상: 'bg-white text-gray-600 border border-gray-200',
  우수상: 'bg-orange-50 text-orange-600',
};

export default function ShowcasePage() {
  const [selected, setSelected] = useState<ShowcaseItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">쇼케이스 갤러리</h1>
      <p className="text-gray-500 mb-8">WhyMatch에서 탄생한 수상작들을 만나보세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {showcaseItems.map((item) => (
          <Card
            key={item.id}
            className="flex flex-col gap-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelected(item)}
          >
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
            <p className="text-sm text-gray-600 flex-1 line-clamp-2">{item.description}</p>

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

      {selected && (
        <ShowcaseDetailModal
          item={selected}
          awardColor={awardColor[selected.award] ?? 'bg-sky-50 text-gray-700'}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
