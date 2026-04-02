// 팀 DB — localStorage 기반 단일 팀 데이터 저장소
// 팀장/팀원 정보를 userId로 관리, 전체 앱이 이 DB를 단일 출처로 사용

import { campTeams } from '@/data/teams';

export interface TeamRecord {
  teamCode: string;
  hackathonSlug: string | null;
  name: string;
  leaderId: string;
  memberIds: string[];   // 팀장 포함 전체 팀원 userId 목록
  isOpen: boolean;
  lookingFor: string[];
  intro: string;
  contact: { type: 'link' | 'form'; url: string };
  createdAt: string;
}

const KEY = 'whymatch_teams_db';

/** 정적 campTeams 데이터로 DB 초기화 */
function seed(): TeamRecord[] {
  return campTeams.map((t) => ({
    teamCode: t.teamCode,
    hackathonSlug: t.hackathonSlug,
    name: t.name,
    leaderId: t.leaderId,
    memberIds: [t.leaderId],
    isOpen: t.isOpen,
    lookingFor: t.lookingFor,
    intro: t.intro,
    contact: t.contact,
    createdAt: t.createdAt,
  }));
}

export function getTeams(): TeamRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
    const initial = seed();
    localStorage.setItem(KEY, JSON.stringify(initial));
    return initial;
  } catch {
    return seed();
  }
}

export function saveTeams(teams: TeamRecord[]): void {
  localStorage.setItem(KEY, JSON.stringify(teams));
}

export function createTeam(team: Omit<TeamRecord, 'memberIds'>): TeamRecord {
  const teams = getTeams();
  const record: TeamRecord = { ...team, memberIds: [team.leaderId] };
  saveTeams([record, ...teams]);
  return record;
}

export function addMember(teamCode: string, userId: string): void {
  const teams = getTeams();
  saveTeams(
    teams.map((t) =>
      t.teamCode === teamCode && !t.memberIds.includes(userId)
        ? { ...t, memberIds: [...t.memberIds, userId] }
        : t
    )
  );
}

export function getTeamsByLeader(leaderId: string): TeamRecord[] {
  return getTeams().filter((t) => t.leaderId === leaderId);
}

export function getTeamsByMember(userId: string): TeamRecord[] {
  return getTeams().filter(
    (t) => t.memberIds.includes(userId) && t.leaderId !== userId
  );
}
