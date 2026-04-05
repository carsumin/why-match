'use client';

import { useState, useCallback } from 'react';
import * as teamDb from '@/lib/teamDb';
import type { TeamRecord } from '@/lib/teamDb';

export type { TeamRecord };

export function useTeamDb() {
  const [teams, setTeams] = useState<TeamRecord[]>(() => {
    if (typeof window === 'undefined') return [];
    return teamDb.getTeams();
  });

  const refresh = useCallback(() => {
    setTeams(teamDb.getTeams());
  }, []);

  function createTeam(team: Omit<TeamRecord, 'memberIds'>) {
    teamDb.createTeam(team);
    refresh();
  }

  function addMember(teamCode: string, userId: string) {
    teamDb.addMember(teamCode, userId);
    refresh();
  }

  return { teams, createTeam, addMember, refresh };
}
