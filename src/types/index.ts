// 공통 타입 정의 — WhyMatch 해커톤 팀 매칭 서비스

// 사용자 역할 종류
export type UserRole = 'frontend' | 'backend' | 'designer' | 'pm' | 'data' | 'devops';

// 매칭 레벨
export type MatchLevel = 'high' | 'medium' | 'low';

// 해커톤 상태
export type HackathonStatus = 'upcoming' | 'ongoing' | 'ended';

// 해커톤 탭 종류
export type HackathonTab = '개요' | '평가' | '일정' | '상금' | '팀' | '제출' | '리더보드';

// 팀원 지원 상태
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

// ──────────────────────────────
// 유저
// ──────────────────────────────
export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  roles: UserRole[];           // 보유 역할 (복수 가능)
  tags: string[];              // 기술 태그 (예: React, Node.js, Figma)
  activeHours: number;         // 하루 평균 활동 시간 (0~24)
  portfolioUrl?: string;
  githubUrl?: string;
}

// ──────────────────────────────
// 해커톤
// ──────────────────────────────
export interface Hackathon {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  description: string;
  tags: string[];              // 해커톤 주제 태그
  status: HackathonStatus;
  startDate: string;           // ISO 8601
  endDate: string;             // ISO 8601
  deadline: string;            // 팀 모집 마감 ISO 8601
  prize: string;               // 총 상금 (예: "1,000만원")
  prizeDetail?: string;
  maxTeamSize: number;
  minTeamSize: number;
  registrationUrl?: string;
  thumbnailUrl?: string;
}

// ──────────────────────────────
// 팀
// ──────────────────────────────
export interface Team {
  id: string;
  name: string;
  hackathonId: string;
  leaderId: string;
  members: User[];
  requiredRoles: UserRole[];   // 아직 필요한 역할
  tags: string[];              // 팀이 원하는 기술 스택
  description?: string;
  activeHoursMin: number;      // 원하는 최소 활동 시간
  activeHoursMax: number;      // 원하는 최대 활동 시간
}

// ──────────────────────────────
// 매칭 결과
// ──────────────────────────────
export interface MatchResult {
  score: number;               // 0~100
  level: MatchLevel;
  reason: string;              // 이유 한 줄 (예: "React 기술이 일치합니다")
  tagScore: number;            // 태그 일치 점수 (0~100)
  roleScore: number;           // 역할 필요도 점수 (0~100)
  timeScore: number;           // 활동 시간 점수 (0~100)
}

// ──────────────────────────────
// 팀 빌딩 시뮬레이터
// ──────────────────────────────
export interface SimulationResult {
  beforeScore: number;         // 합류 전 팀 평균 점수
  afterScore: number;          // 합류 후 팀 평균 점수
  delta: number;               // 점수 변화 (afterScore - beforeScore)
  newMember: User;
}

// ──────────────────────────────
// 메시지 / 지원
// ──────────────────────────────
export interface Application {
  id: string;
  fromUserId: string;
  toTeamId: string;
  status: ApplicationStatus;
  message?: string;
  createdAt: string;
}

// ──────────────────────────────
// 랭킹
// ──────────────────────────────
export interface RankingEntry {
  rank: number;
  team: Team;
  hackathon: Hackathon;
  prize: string;
  award: string;               // 수상 종류 (예: "대상", "최우수상")
}
