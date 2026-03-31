'use client';

// 메시지 수락 대기 상태 전역 공유 Context

import { createContext, useContext, useState } from 'react';
import { inboxMessages } from '@/data/messages';

interface MessageContextValue {
  pendingCount: number;
  resolveMessage: (id: string) => void; // 수락 또는 거절 시 호출
}

const MessageContext = createContext<MessageContextValue>({
  pendingCount: 0,
  resolveMessage: () => {},
});

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const [pendingIds, setPendingIds] = useState<Set<string>>(
    new Set(inboxMessages.filter((m) => m.status === 'pending').map((m) => m.id))
  );

  function resolveMessage(id: string) {
    setPendingIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <MessageContext.Provider value={{ pendingCount: pendingIds.size, resolveMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext() {
  return useContext(MessageContext);
}
