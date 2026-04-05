'use client';

import { useState, useEffect } from 'react';
import { users } from '@/data/teams';
import type { User } from '@/types';

export const CURRENT_USER_KEY = 'whymatch_my_user_id';

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved && users.find((u) => u.id === saved)) {
      setUserId(saved);
    }
  }, []);

  function setCurrentUser(id: string) {
    localStorage.setItem(CURRENT_USER_KEY, id);
    setUserId(id);
  }

  const currentUser: User | null = users.find((u) => u.id === userId) ?? null;

  return { currentUser, setCurrentUser };
}
