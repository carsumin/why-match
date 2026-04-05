// 메시지 DB — localStorage 기반 단일 메시지 저장소

import { inboxMessages, sentMessages } from '@/data/messages';
import type { MessageDisplay } from '@/data/messages';

const MESSAGES_KEY = 'whymatch_messages_db';
const BUBBLES_KEY = 'whymatch_chat_bubbles';

export interface StoredBubble {
  id: string;
  fromUserId: string;
  text: string;
  createdAt: string;
}

let _cache: MessageDisplay[] | null = null;

function seed(): MessageDisplay[] {
  return [...inboxMessages, ...sentMessages];
}

export function getMessages(): MessageDisplay[] {
  if (_cache) return _cache;
  try {
    const raw = localStorage.getItem(MESSAGES_KEY);
    if (raw) {
      const existing: MessageDisplay[] = JSON.parse(raw);
      // 새 시드 메시지 병합
      const existingIds = new Set(existing.map((m) => m.id));
      const newFromSeed = seed().filter((m) => !existingIds.has(m.id));
      if (newFromSeed.length > 0) {
        const merged = [...existing, ...newFromSeed];
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(merged));
        _cache = merged;
        return merged;
      }
      _cache = existing;
      return existing;
    }
    const initial = seed();
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(initial));
    _cache = initial;
    return initial;
  } catch {
    return seed();
  }
}

export function saveMessages(messages: MessageDisplay[]): void {
  _cache = messages;
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function addMessage(msg: MessageDisplay): void {
  const messages = getMessages();
  saveMessages([msg, ...messages]);
}

export function updateMessageStatus(id: string, status: 'accepted' | 'rejected'): void {
  saveMessages(getMessages().map((m) => (m.id === id ? { ...m, status } : m)));
}

export function markAsRead(id: string): void {
  saveMessages(getMessages().map((m) => (m.id === id ? { ...m, isRead: true } : m)));
}

/** 해당 메시지의 가장 최근 버블 (저장된 것 기준) */
export function getLatestBubble(msgId: string): StoredBubble | null {
  const bubbles = getChatBubbles(msgId);
  return bubbles.length > 0 ? bubbles[bubbles.length - 1] : null;
}

// ── 채팅 버블 ──

export function getChatBubbles(msgId: string): StoredBubble[] {
  try {
    const raw = localStorage.getItem(BUBBLES_KEY);
    const store: Record<string, StoredBubble[]> = raw ? JSON.parse(raw) : {};
    return store[msgId] ?? [];
  } catch { return []; }
}

export function addChatBubble(msgId: string, bubble: StoredBubble): void {
  try {
    const raw = localStorage.getItem(BUBBLES_KEY);
    const store: Record<string, StoredBubble[]> = raw ? JSON.parse(raw) : {};
    store[msgId] = [...(store[msgId] ?? []), bubble];
    localStorage.setItem(BUBBLES_KEY, JSON.stringify(store));
  } catch {}
}
