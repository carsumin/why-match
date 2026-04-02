'use client';

// 메시지 전역 상태 — 현재 로그인 유저 기반 필터링 + localStorage 상태 지속

import { createContext, useContext, useState, useEffect } from 'react';
import { inboxMessages as baseInbox, sentMessages as baseSent } from '@/data/messages';
import * as teamDb from '@/lib/teamDb';
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

    // 내 팀 코드 목록 (내가 리더인 팀) — teamDb 기반
    const myTeamCodes = teamDb.getTeamsByLeader(userId ?? '')
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

    // 수락된 sent 메시지 → 팀 DB 자동 동기화 (하드코딩 초기값 포함)
    filteredSent.forEach((m) => {
      if (m.status === 'accepted') {
        teamDb.addMember(m.teamCode, m.fromUserId);
      }
    });

    setInbox(filteredInbox);
    setSent(filteredSent);
  }, []);

  function updateStatus(id: string, status: 'accepted' | 'rejected') {
    const overrides = loadOverrides();
    overrides[id] = status;
    localStorage.setItem(STATUS_KEY, JSON.stringify(overrides));

    // 수락 시 팀 DB에 멤버 추가
    if (status === 'accepted') {
      const msg = inbox.find((m) => m.id === id);
      if (msg) teamDb.addMember(msg.teamCode, msg.fromUserId);
    }

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
