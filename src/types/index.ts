// 공통 타입 정의 — WhyMatch 해커톤 팀 매칭 서비스

// ──────────────────────────────
// 기존 타입 (simulate / profile 페이지에서 사용 중)
// ──────────────────────────────

export type UserRole = 'frontend' | 'backend' | 'designer' | 'pm' | 'data' | 'devops';
export type MatchLevel = 'high' | 'medium' | 'low';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  roles: UserRole[];
  tags: string[];
  activeHours: number;
  portfolioUrl?: string;
  githubUrl?: string;
}

/** 구형 Team 인터페이스 — simulate/profile/matching 전용 */
export interface LegacyTeam {
  id: string;
  name: string;
  hackathonId: string;
  leaderId: string;
  members: User[];
  requiredRoles: UserRole[];
  tags: string[];
  description?: string;
  activeHoursMin: number;
  activeHoursMax: number;
}

/** 하위 호환 alias — matching.ts / simulate 페이지 전용 */
export type Team = LegacyTeam;

export interface MatchResult {
  score: number;
  level: MatchLevel;
  reason: string;
  tagScore: number;
  roleScore: number;
  timeScore: number;
}

export interface SimulationResult {
  beforeScore: number;
  afterScore: number;
  delta: number;
  newMember: User;
}

export interface Application {
  id: string;
  fromUserId: string;
  toTeamId: string;
  status: ApplicationStatus;
  message?: string;
  createdAt: string;
}

// ──────────────────────────────
// SPEC.md 기준 신규 타입
// ──────────────────────────────

export type HackathonStatus = 'ongoing' | 'ended' | 'upcoming';
export type HackathonTab = '개요' | '평가' | '일정' | '상금' | '팀' | '제출' | '리더보드';

/** 해커톤 목록용 경량 타입 — status는 period 날짜에서 동적 계산 */
export interface HackathonListItem {
  slug: string;
  title: string;
  status: HackathonStatus; // computeHackathonStatus()로 채워짐 (데이터에 직접 쓰지 않음)
  tags: string[];
  thumbnailUrl: string;
  period: {
    timezone: string;
    startAt: string;
    submissionDeadlineAt: string;
    endAt: string;
  };
  links: {
    detail: string;
    rules: string;
    faq: string;
  };
}

/** 해커톤 상세용 sections 타입 */
export interface HackathonDetail {
  slug: string;
  title: string;
  sections: {
    overview: {
      summary: string;
      teamPolicy: {
        allowSolo: boolean;
        maxTeamSize: number;
      };
      /** 안내 탭 내용을 개요에 포함 */
      notice: string[];
      infoLinks: {
        rules: string;
        faq: string;
      };
    };
    eval: {
      metricName: string;
      description: string;
      scoreSource?: 'metric' | 'vote';
      scoreDisplay?: {
        label: string;
        breakdown: {
          key: string;
          label: string;
          weightPercent: number;
        }[];
      };
      limits?: {
        maxRuntimeSec?: number;
        maxSubmissionsPerDay?: number;
      };
    };
    schedule: {
      timezone: string;
      milestones: {
        name: string;
        at: string;
      }[];
    };
    prize: {
      items: {
        place: string;
        amountKRW: number;
      }[];
    };
    teams: {
      campEnabled: boolean;
      listUrl: string;
    };
    submit: {
      allowedArtifactTypes: string[];
      submissionUrl: string;
      guide: string[];
      submissionItems?: {
        key: string;
        title: string;
        format: string;
      }[];
    };
    leaderboard: {
      publicLeaderboardUrl: string;
      note: string;
    };
  };
}

/** SPEC.md 기준 팀 타입 (camp 페이지용) */
export interface CampTeam {
  teamCode: string;
  hackathonSlug: string | null;
  name: string;
  isOpen: boolean;
  memberCount: number;
  lookingFor: string[];
  intro: string;
  contact: {
    type: 'link' | 'form';
    url: string;
  };
  createdAt: string;
}

/** 리더보드 엔트리 */
export interface LeaderboardEntry {
  rank: number;
  teamName: string;
  score: number;
  submittedAt: string;
  scoreBreakdown?: {
    participant: number;
    judge: number;
  };
  artifacts?: {
    webUrl?: string;
    pdfUrl?: string;
    planTitle?: string;
  };
}

/** 해커톤별 리더보드 */
export interface Leaderboard {
  hackathonSlug: string;
  updatedAt: string;
  entries: LeaderboardEntry[];
}

/** 글로벌 랭킹 엔트리 */
export interface GlobalRankingEntry {
  rank: number;
  nickname: string;
  points: number;
  delta?: number; // 순위 변동 (양수=상승, 음수=하락, 0=유지)
}
