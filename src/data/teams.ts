// 팀 및 유저 더미 데이터

import type { User, LegacyTeam, CampTeam } from '@/types';

// ──────────────────────────────
// 유저 더미 데이터 (10명)
// ──────────────────────────────
export const users: User[] = [
  {
    id: 'u-001',
    name: '김지훈',
    bio: 'React와 Next.js를 주로 다루는 프론트엔드 개발자입니다.',
    roles: ['frontend'],
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'],
    activeHours: 6,
    githubUrl: 'https://github.com',
  },
  {
    id: 'u-002',
    name: '이수아',
    bio: 'Node.js와 Spring Boot를 다루는 풀스택 개발자입니다.',
    roles: ['backend'],
    tags: ['Node.js', 'Spring', 'PostgreSQL', 'Docker'],
    activeHours: 8,
    githubUrl: 'https://github.com',
  },
  {
    id: 'u-003',
    name: '박민준',
    bio: 'Figma 전문 UI/UX 디자이너입니다. 사용자 리서치도 합니다.',
    roles: ['designer'],
    tags: ['Figma', 'UI', 'UX', 'Prototyping'],
    activeHours: 7,
    portfolioUrl: 'https://notion.so',
  },
  {
    id: 'u-004',
    name: '최유나',
    bio: '스타트업 PM 경력 3년. 기획과 데이터 분석을 함께 합니다.',
    roles: ['pm'],
    tags: ['기획', 'Notion', 'Analytics', 'SQL'],
    activeHours: 5,
  },
  {
    id: 'u-005',
    name: '정도현',
    bio: 'PyTorch 기반 딥러닝 모델 개발 경험 보유.',
    roles: ['data'],
    tags: ['Python', 'PyTorch', 'ML', 'AI', 'LLM'],
    activeHours: 9,
    githubUrl: 'https://github.com',
  },
  {
    id: 'u-006',
    name: '한서연',
    bio: 'Vue.js와 React 모두 다루는 프론트엔드 개발자.',
    roles: ['frontend'],
    tags: ['Vue.js', 'React', 'JavaScript', 'CSS'],
    activeHours: 4,
    githubUrl: 'https://github.com',
  },
  {
    id: 'u-007',
    name: '윤재원',
    bio: 'AWS, GCP 기반 인프라 설계 및 CI/CD 파이프라인 구축.',
    roles: ['devops'],
    tags: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    activeHours: 6,
    githubUrl: 'https://github.com',
  },
  {
    id: 'u-008',
    name: '임소현',
    bio: 'Kotlin + Spring Boot 백엔드 개발자.',
    roles: ['backend'],
    tags: ['Kotlin', 'Spring', 'Redis', 'MySQL'],
    activeHours: 7,
  },
  {
    id: 'u-009',
    name: '강태민',
    bio: '블록체인 DApp 개발 경험 2년. Solidity 전문.',
    roles: ['backend', 'frontend'],
    tags: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
    activeHours: 8,
    githubUrl: 'https://github.com',
  },
  {
    id: 'u-010',
    name: '오지은',
    bio: 'Product Manager + 데이터 분석 겸업. 스타트업 출신.',
    roles: ['pm', 'data'],
    tags: ['SQL', 'Tableau', '기획', 'Analytics', 'Python'],
    activeHours: 6,
  },
];

// ──────────────────────────────
// 구형 팀 데이터 — simulate / profile 페이지 전용 (export 명 유지)
// ──────────────────────────────
export const teams: LegacyTeam[] = [
  {
    id: 't-001',
    name: '팀 루나틱',
    hackathonId: 'hk-001',
    leaderId: 'u-005',
    members: [users[4], users[1]], // 정도현, 이수아
    requiredRoles: ['frontend', 'designer'],
    tags: ['AI', 'Python', 'React', 'ML', 'LLM'],
    description: 'LLM 기반 의료 AI 솔루션을 만드는 팀입니다. 프론트와 디자이너 구합니다!',
    activeHoursMin: 6,
    activeHoursMax: 10,
  },
  {
    id: 't-002',
    name: '404found',
    hackathonId: 'hk-001',
    leaderId: 'u-001',
    members: [users[0], users[2]], // 김지훈, 박민준
    requiredRoles: ['backend', 'pm'],
    tags: ['React', 'Next.js', 'TypeScript', 'Node.js', 'AI'],
    description: '명세서 기반으로 기본 기능을 빠르게 완성하고 UX 확장을 노립니다.',
    activeHoursMin: 5,
    activeHoursMax: 8,
  },
  {
    id: 't-003',
    name: 'Web3 파이오니어',
    hackathonId: 'hk-002',
    leaderId: 'u-009',
    members: [users[8]], // 강태민
    requiredRoles: ['designer', 'pm', 'backend'],
    tags: ['Web3', 'Solidity', 'React', 'Blockchain', 'TypeScript'],
    description: 'NFT 기반 음악 저작권 플랫폼을 만듭니다. 다양한 역할 환영!',
    activeHoursMin: 6,
    activeHoursMax: 10,
  },
  {
    id: 't-004',
    name: '디자인 씽커스',
    hackathonId: 'hk-003',
    leaderId: 'u-003',
    members: [users[2], users[3]], // 박민준, 최유나
    requiredRoles: ['frontend'],
    tags: ['Figma', 'UI', 'UX', 'React', 'Prototyping'],
    description: '노인 케어 서비스 UX를 디자인하는 팀입니다. 구현 가능한 개발자 필요!',
    activeHoursMin: 4,
    activeHoursMax: 7,
  },
  {
    id: 't-005',
    name: '데이터 드리머스',
    hackathonId: 'hk-001',
    leaderId: 'u-010',
    members: [users[9], users[7]], // 오지은, 임소현
    requiredRoles: ['frontend', 'data'],
    tags: ['Python', 'Analytics', 'SQL', 'ML', 'AI', 'Node.js'],
    description: '환경 데이터 시각화 및 예측 서비스 개발 팀입니다.',
    activeHoursMin: 5,
    activeHoursMax: 8,
  },
];

/** ID로 유저 조회 */
export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

/** 해커톤 ID로 구형 팀 목록 조회 */
export function getTeamsByHackathon(hackathonId: string): LegacyTeam[] {
  return teams.filter((t) => t.hackathonId === hackathonId);
}

// ──────────────────────────────
// SPEC.md 기준 팀 데이터 (camp 페이지용)
// ──────────────────────────────
export const campTeams: CampTeam[] = [
  {
    teamCode: 'T-ALPHA',
    hackathonSlug: 'aimers-8-model-lite',
    leaderId: 'u-002',
    name: 'Team Alpha',
    isOpen: true,
    memberCount: 3,
    lookingFor: ['Backend', 'ML Engineer'],
    intro: '추론 최적화/경량화 실험을 함께 진행할 팀원을 찾습니다.',
    contact: { type: 'link', url: 'https://open.kakao.com/o/example1' },
    createdAt: '2026-02-20T11:00:00+09:00',
  },
  {
    teamCode: 'T-BETA',
    hackathonSlug: 'monthly-vibe-coding-2026-02',
    leaderId: 'u-003',
    name: 'PromptRunners',
    isOpen: true,
    memberCount: 1,
    lookingFor: ['Frontend', 'Designer'],
    intro: '프롬프트 품질 점수화 + 개선 가이드 UX를 기획합니다.',
    contact: { type: 'link', url: 'https://forms.gle/example2' },
    createdAt: '2026-02-18T18:30:00+09:00',
  },
  {
    teamCode: 'T-HANDOVER-01',
    hackathonSlug: 'daker-handover-2026-03',
    leaderId: 'u-001',
    name: '404found',
    isOpen: true,
    memberCount: 3,
    lookingFor: ['Frontend', 'Designer'],
    intro: '명세서 기반으로 기본 기능을 빠르게 완성하고 UX 확장을 노립니다.',
    contact: { type: 'link', url: 'https://open.kakao.com/o/example3' },
    createdAt: '2026-03-04T11:00:00+09:00',
  },
  {
    teamCode: 'T-HANDOVER-02',
    hackathonSlug: 'daker-handover-2026-03',
    leaderId: 'u-004',
    name: 'LGTM',
    isOpen: false,
    memberCount: 5,
    lookingFor: [],
    intro: '기획서-구현-문서화를 깔끔하게 맞추는 방향으로 진행합니다.',
    contact: { type: 'link', url: 'https://forms.gle/example4' },
    createdAt: '2026-03-05T09:20:00+09:00',
  },
];
