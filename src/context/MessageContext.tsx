'use client';

// 메시지 전역 상태 — 현재 로그인 유저 기반 필터링 + localStorage 상태 지속

import { createContext, useContext, useState, useEffect } from 'react';
import * as messageDb from '@/lib/messageDb';
import * as teamDb from '@/lib/teamDb';
import { getUserById } from '@/data/teams';
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
  unreadCount: number;
  updateStatus: (id: string, status: 'accepted' | 'rejected') => void;
  sendMessage: (params: SendMessageParams) => void;
  markAsRead: (id: string) => void;
}

const MessageContext = createContext<MessageContextValue>({
  inbox: [],
  sent: [],
  unreadCount: 0,
  updateStatus: () => {},
  sendMessage: () => {},
  markAsRead: () => {},
});

/** fromUserName을 userId 기준으로 실제 이름으로 보정 */
function normalizeFromUserName(m: MessageDisplay): MessageDisplay {
  const user = getUserById(m.fromUserId);
  return user ? { ...m, fromUserName: user.name } : m;
}

function filterByUser(userId: string) {
  const all = messageDb.getMessages().map(normalizeFromUserName);

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

  function markAsRead(id: string) {
    messageDb.markAsRead(id);
    reload();
  }

  // 안읽음: 받은 메시지(미읽음) + 보낸 메시지(수락/거절됐는데 미읽음)
  const unreadCount =
    inbox.filter((m) => !m.isRead).length +
    sent.filter((m) => m.status !== 'pending' && !m.isRead).length;

  return (
    <MessageContext.Provider value={{ inbox, sent, unreadCount, updateStatus, sendMessage, markAsRead }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  return useContext(MessageContext);
}
