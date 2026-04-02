'use client';

// 메시지 전역 상태 — 현재 로그인 유저 기반 필터링 + localStorage 상태 지속

import { createContext, useContext, useState, useEffect } from 'react';
import { inboxMessages as baseInbox, sentMessages as baseSent } from '@/data/messages';
import { campTeams } from '@/data/teams';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import type { MessageDisplay } from '@/data/messages';

const STATUS_KEY = 'whymatch_message_statuses';
type StatusOverride = Record<string, 'pending' | 'accepted' | 'rejected'>;

function loadOverrides(): StatusOverride {
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function applyOverrides(messages: MessageDisplay[], overrides: StatusOverride): MessageDisplay[] {
  return messages.map((m) => overrides[m.id] ? { ...m, status: overrides[m.id] } : m);
}

interface MessageContextValue {
  inbox: MessageDisplay[];
  sent: MessageDisplay[];
  pendingCount: number;
  updateStatus: (id: string, status: 'accepted' | 'rejected') => void;
}

const MessageContext = createContext<MessageContextValue>({
  inbox: [],
  sent: [],
  pendingCount: 0,
  updateStatus: () => {},
});

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [inbox, setInbox] = useState<MessageDisplay[]>([]);
  const [sent, setSent] = useState<MessageDisplay[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    const overrides = loadOverrides();

    // 내 팀 코드 목록 (내가 리더인 팀)
    const myTeamCodes = campTeams
      .filter((t) => t.leaderId === userId)
      .map((t) => t.teamCode);

    // 받은 메시지: 내 팀에 지원한 메시지
    const filteredInbox = applyOverrides(
      baseInbox.filter((m) => myTeamCodes.includes(m.teamCode)),
      overrides
    );

    // 보낸 메시지: 내가 보낸 메시지
    const filteredSent = applyOverrides(
      baseSent.filter((m) => m.fromUserId === userId),
      overrides
    );

    setInbox(filteredInbox);
    setSent(filteredSent);
  }, []);

  function updateStatus(id: string, status: 'accepted' | 'rejected') {
    // localStorage에 저장
    const overrides = loadOverrides();
    overrides[id] = status;
    localStorage.setItem(STATUS_KEY, JSON.stringify(overrides));

    // 상태 업데이트
    setInbox((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    setSent((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
  }

  const pendingCount = inbox.filter((m) => m.status === 'pending').length;

  return (
    <MessageContext.Provider value={{ inbox, sent, pendingCount, updateStatus }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  return useContext(MessageContext);
}
