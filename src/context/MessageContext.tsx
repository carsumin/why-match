'use client';

// 메시지 전역 상태 — 현재 로그인 유저 기반 필터링 + localStorage 상태 지속

import { createContext, useContext, useState, useEffect } from 'react';
import * as messageDb from '@/lib/messageDb';
import * as teamDb from '@/lib/teamDb';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import type { MessageDisplay } from '@/data/messages';
import type { User } from '@/types';

interface SendMessageParams {
  teamCode: string;
  teamName: string;
  hackathonSlug: string | null;
  message: string;
  currentUser: User;
}

interface MessageContextValue {
  inbox: MessageDisplay[];
  sent: MessageDisplay[];
  pendingCount: number;
  updateStatus: (id: string, status: 'accepted' | 'rejected') => void;
  sendMessage: (params: SendMessageParams) => void;
}

const MessageContext = createContext<MessageContextValue>({
  inbox: [],
  sent: [],
  pendingCount: 0,
  updateStatus: () => {},
  sendMessage: () => {},
});

function filterByUser(userId: string) {
  const all = messageDb.getMessages();

  // 내 팀 코드 목록 (내가 리더인 팀)
  const myTeamCodes = teamDb.getTeamsByLeader(userId).map((t) => t.teamCode);

  const inbox = all
    .filter((m) => myTeamCodes.includes(m.teamCode))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const sent = all
    .filter((m) => m.fromUserId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return { inbox, sent };
}

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [inbox, setInbox] = useState<MessageDisplay[]>([]);
  const [sent, setSent] = useState<MessageDisplay[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (!userId) return;

    const { inbox: filteredInbox, sent: filteredSent } = filterByUser(userId);

    // 수락된 sent 메시지 → 팀 DB 자동 동기화
    filteredSent.forEach((m) => {
      if (m.status === 'accepted') teamDb.addMember(m.teamCode, m.fromUserId);
    });

    setInbox(filteredInbox);
    setSent(filteredSent);
  }, []);

  function reload() {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (!userId) return;
    const { inbox: i, sent: s } = filterByUser(userId);
    setInbox(i);
    setSent(s);
  }

  function updateStatus(id: string, status: 'accepted' | 'rejected') {
    messageDb.updateMessageStatus(id, status);

    if (status === 'accepted') {
      const msg = messageDb.getMessages().find((m) => m.id === id);
      if (msg) teamDb.addMember(msg.teamCode, msg.fromUserId);
    }

    reload();
  }

  function sendMessage({ teamCode, teamName, hackathonSlug, message, currentUser }: SendMessageParams) {
    const newMsg: MessageDisplay = {
      id: `msg-${Date.now()}`,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      fromUserRole: currentUser.roles[0] ?? '',
      teamCode,
      teamName,
      hackathonSlug,
      message,
      status: 'pending',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    messageDb.addMessage(newMsg);
    reload();
  }

  const pendingCount = inbox.filter((m) => m.status === 'pending').length;

  return (
    <MessageContext.Provider value={{ inbox, sent, pendingCount, updateStatus, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  return useContext(MessageContext);
}
