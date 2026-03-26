// 매칭 적합도 계산 로직 — WhyMatch
// 공식: 태그 일치(40%) + 역할 필요도(40%) + 활동 시간(20%)

import type { User, Team, MatchResult, MatchLevel, SimulationResult } from '@/types';

// ──────────────────────────────
// 내부 헬퍼 함수
// ──────────────────────────────

/** 두 배열의 교집합 개수를 반환 */
function countIntersection<T>(a: T[], b: T[]): number {
  return a.filter((item) => b.includes(item)).length;
}

/** 활동 시간 호환성 점수 계산 (0~100) */
function calcTimeScore(userHours: number, teamMin: number, teamMax: number): number {
  if (userHours >= teamMin && userHours <= teamMax) return 100;
  if (userHours < teamMin) {
    // 팀 최소 시간보다 낮을수록 감점
    const diff = teamMin - userHours;
    return Math.max(0, 100 - diff * 15);
  }
  // 팀 최대 시간보다 높을수록 소폭 감점 (열정적인 편이라 큰 패널티 없음)
  const diff = userHours - teamMax;
  return Math.max(0, 100 - diff * 5);
}

// ──────────────────────────────
// 핵심 계산 함수
// ──────────────────────────────

/**
 * 유저와 팀 간 적합도 점수를 계산한다.
 * - 태그 일치: 40%
 * - 역할 필요도: 40%
 * - 활동 시간: 20%
 */
export function calculateMatchScore(user: User, team: Team): MatchResult {
  // 1. 태그 일치 점수 (0~100)
  const matchedTagCount = countIntersection(user.tags, team.tags);
  const maxTags = Math.max(team.tags.length, 1);
  const tagScore = Math.min(100, (matchedTagCount / maxTags) * 100);

  // 2. 역할 필요도 점수 (0~100)
  // 유저가 팀이 필요로 하는 역할을 보유하고 있으면 고득점
  const matchedRoleCount = countIntersection(user.roles, team.requiredRoles);
  const maxRoles = Math.max(team.requiredRoles.length, 1);
  const roleScore = Math.min(100, (matchedRoleCount / maxRoles) * 100);

  // 3. 활동 시간 점수 (0~100)
  const timeScore = calcTimeScore(user.activeHours, team.activeHoursMin, team.activeHoursMax);

  // 4. 가중 합산
  const score = Math.round(tagScore * 0.4 + roleScore * 0.4 + timeScore * 0.2);

  const level = getMatchLevel(score);
  const reason = getMatchReason(user, team, { tagScore, roleScore, timeScore });

  return { score, level, reason, tagScore, roleScore, timeScore };
}

/**
 * 점수를 레벨로 변환한다.
 * - 80 이상: high
 * - 60~79: medium
 * - 60 미만: low
 */
export function getMatchLevel(score: number): MatchLevel {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

/**
 * 매칭 이유를 한 줄 텍스트로 반환한다.
 * 가장 높은 점수 항목을 기준으로 메시지를 생성한다.
 */
export function getMatchReason(
  user: User,
  team: Team,
  scores: { tagScore: number; roleScore: number; timeScore: number }
): string {
  const { tagScore, roleScore, timeScore } = scores;

  // 가장 높은 항목 기준으로 이유 생성
  const maxScore = Math.max(tagScore, roleScore, timeScore);

  if (maxScore === tagScore && tagScore > 0) {
    const matched = user.tags.filter((t) => team.tags.includes(t));
    if (matched.length > 0) {
      return `${matched.slice(0, 2).join(', ')} 기술이 일치합니다`;
    }
  }

  if (maxScore === roleScore && roleScore > 0) {
    const matched = user.roles.filter((r) => team.requiredRoles.includes(r));
    if (matched.length > 0) {
      const roleLabel: Record<string, string> = {
        frontend: '프론트엔드',
        backend: '백엔드',
        designer: '디자이너',
        pm: 'PM',
        data: '데이터',
        devops: 'DevOps',
      };
      return `팀에서 필요한 ${roleLabel[matched[0]] ?? matched[0]} 역할을 보유하고 있습니다`;
    }
  }

  if (timeScore >= 80) {
    return `활동 시간대가 잘 맞습니다 (${user.activeHours}h/day)`;
  }

  return '전반적으로 팀 구성에 어울리는 프로필입니다';
}

// ──────────────────────────────
// 팀 빌딩 시뮬레이터
// ──────────────────────────────

/**
 * 현재 팀 전체의 평균 적합도 점수를 계산한다.
 * 팀원 각자와 팀 간 점수의 평균값을 반환한다.
 */
export function calcTeamAverageScore(team: Team): number {
  if (team.members.length === 0) return 0;
  const scores = team.members.map((member) => calculateMatchScore(member, team).score);
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

/**
 * 새 팀원이 합류했을 때 팀 점수 변화를 시뮬레이션한다.
 * requiredRoles에서 newMember의 역할을 제거한 가상 팀으로 after 점수를 계산한다.
 */
export function simulateTeamScore(team: Team, newMember: User): SimulationResult {
  const beforeScore = calcTeamAverageScore(team);

  // 가상 팀: 새 멤버 추가 + 충족된 역할을 requiredRoles에서 제거
  const updatedRequiredRoles = team.requiredRoles.filter(
    (role) => !newMember.roles.includes(role)
  );
  const virtualTeam: Team = {
    ...team,
    members: [...team.members, newMember],
    requiredRoles: updatedRequiredRoles,
  };

  const afterScore = calcTeamAverageScore(virtualTeam);
  const delta = afterScore - beforeScore;

  return { beforeScore, afterScore, delta, newMember };
}
