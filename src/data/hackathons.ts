// 해커톤 더미 데이터

import type { Hackathon } from '@/types';

export const hackathons: Hackathon[] = [
  {
    id: 'hk-001',
    slug: 'ai-innovation-2025',
    title: 'AI 이노베이션 해커톤 2025',
    organizer: '과학기술정보통신부',
    description:
      '인공지능 기술로 사회 문제를 해결하는 아이디어를 겨루는 국내 최대 AI 해커톤입니다. 의료, 환경, 교육 분야 솔루션을 환영합니다.',
    tags: ['AI', 'ML', 'Python', 'DeepLearning', 'LLM'],
    status: 'ongoing',
    startDate: '2025-04-01T09:00:00+09:00',
    endDate: '2025-04-03T18:00:00+09:00',
    deadline: '2025-03-28T23:59:00+09:00',
    prize: '5,000만원',
    prizeDetail: '대상 2,000만원 / 최우수상 1,000만원 / 우수상 500만원×4',
    maxTeamSize: 5,
    minTeamSize: 2,
    registrationUrl: '#',
    thumbnailUrl: '/images/hackathon-ai.png',
  },
  {
    id: 'hk-002',
    slug: 'web3-builders-2025',
    title: 'Web3 빌더스 챌린지',
    organizer: '블록체인진흥원',
    description:
      '탈중앙화 기술로 금융·게임·소셜 분야에서 혁신적인 dApp을 만들어보세요. Solidity, Move, Rust 모두 환영합니다.',
    tags: ['Web3', 'Blockchain', 'Solidity', 'React', 'TypeScript'],
    status: 'upcoming',
    startDate: '2025-05-10T10:00:00+09:00',
    endDate: '2025-05-12T20:00:00+09:00',
    deadline: '2025-05-05T23:59:00+09:00',
    prize: '3,000만원',
    prizeDetail: '대상 1,500만원 / 우수상 750만원×2',
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationUrl: '#',
    thumbnailUrl: '/images/hackathon-web3.png',
  },
  {
    id: 'hk-003',
    slug: 'ux-design-sprint',
    title: 'UX 디자인 스프린트 2025',
    organizer: '한국디자인진흥원',
    description:
      '48시간 안에 실제 사용자 문제를 발굴하고 프로토타입까지 완성하는 디자인 중심 해커톤입니다.',
    tags: ['UX', 'UI', 'Figma', 'Prototyping', 'Research'],
    status: 'ended',
    startDate: '2025-02-15T09:00:00+09:00',
    endDate: '2025-02-17T18:00:00+09:00',
    deadline: '2025-02-10T23:59:00+09:00',
    prize: '1,000만원',
    prizeDetail: '대상 500만원 / 우수상 250만원×2',
    maxTeamSize: 4,
    minTeamSize: 2,
    registrationUrl: '#',
    thumbnailUrl: '/images/hackathon-ux.png',
  },
];

/** slug로 해커톤 단건 조회 */
export function getHackathonBySlug(slug: string): Hackathon | undefined {
  return hackathons.find((h) => h.slug === slug);
}

/** 진행 중인 해커톤 중 마감이 가장 임박한 것 반환 (카운트다운 배너용) */
export function getNearestDeadlineHackathon(): Hackathon | undefined {
  const now = Date.now();
  return hackathons
    .filter((h) => h.status !== 'ended' && new Date(h.deadline).getTime() > now)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];
}
