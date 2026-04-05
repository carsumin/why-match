'use client';

// 메시지 채팅창 모달

import { useEffect, useRef, useState, useCallback } from 'react';
import type { MessageDisplay } from '@/data/messages';
import * as messageDb from '@/lib/messageDb';
import * as teamDb from '@/lib/teamDb';
import { getUserById } from '@/data/teams';
import { CURRENT_USER_KEY } from '@/hooks/useCurrentUser';
import Confetti from '@/components/ui/Confetti';

interface ChatBubble {
  id: string;
  fromUserId: string;
  text: string;
  time: Date;
}

interface Props {
  msg: MessageDisplay;
  isInbox: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: 'accepted' | 'rejected') => void;
}

const STATUS_CONFIG = {
  pending: { label: '대기 중', className: 'bg-yellow-50 text-yellow-600 border border-yellow-200' },
  accepted: { label: '수락됨', className: 'bg-green-50 text-green-700 border border-green-200' },
  rejected: { label: '거절됨', className: 'bg-red-50 text-red-500 border border-red-200' },
} as const;

function formatTime(d: Date) {
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

function formatDateLabel(d: Date) {
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function SystemNotice({ status, contactUrl }: { status: MessageDisplay['status']; contactUrl?: string }) {
  if (status === 'accepted') {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 text-center">
          <p className="text-xs text-green-700 font-semibold mb-2">지원이 수락되었습니다 🎉</p>
          {contactUrl && (
            <a
              href={contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold px-4 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 transition-colors"
            >
              카카오톡으로 연결 →
            </a>
          )}
        </div>
      </div>
    );
  }
  if (status === 'rejected') {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-2">
          <p className="text-xs text-red-400">아쉽게도 이번엔 함께하기 어렵습니다.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-center my-2">
      <div className="bg-yellow-50 border border-yellow-100 rounded-2xl px-4 py-2">
        <p className="text-xs text-yellow-600">답변을 기다리고 있습니다...</p>
      </div>
    </div>
  );
}

export default function ChatModal({ msg, isInbox, onClose, onStatusChange }: Props) {
  const currentUserId = typeof window !== 'undefined'
    ? localStorage.getItem(CURRENT_USER_KEY) ?? ''
    : '';

  // 헤더에 표시할 상대방: 받은 메시지 → 지원자, 보낸 메시지 → 팀장
  const counterpart = isInbox
    ? { name: msg.fromUserName, role: msg.fromUserRole }
    : (() => {
        const team = teamDb.getTeams().find((t) => t.teamCode === msg.teamCode);
        const leader = team ? getUserById(team.leaderId) : null;
        return { name: leader?.name ?? msg.teamName, role: leader?.roles[0] ?? '' };
      })();

  const [status, setStatus] = useState(msg.status);
  const [showConfetti, setShowConfetti] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // 초기 버블: msg 자체 + 저장된 추가 버블
  const [bubbles, setBubbles] = useState<ChatBubble[]>(() => {
    const initial: ChatBubble = {
      id: 'init',
      fromUserId: msg.fromUserId,
      text: msg.message,
      time: new Date(msg.createdAt),
    };
    const stored = messageDb.getChatBubbles(msg.id).map((b) => ({
      id: b.id,
      fromUserId: b.fromUserId,
      text: b.text,
      time: new Date(b.createdAt),
    }));
    return [initial, ...stored];
  });

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { label, className } = STATUS_CONFIG[status];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [bubbles, status]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const storedBubble: messageDb.StoredBubble = {
      id: `b-${Date.now()}`,
      fromUserId: currentUserId,
      text,
      createdAt: new Date().toISOString(),
    };
    messageDb.addChatBubble(msg.id, storedBubble);

    setBubbles((prev) => [
      ...prev,
      { id: storedBubble.id, fromUserId: currentUserId, text, time: new Date(storedBubble.createdAt) },
    ]);
    setInputValue('');
  }, [inputValue, currentUserId, msg.id]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function handleAccept() {
    setStatus('accepted');
    onStatusChange(msg.id, 'accepted');
    setShowConfetti(true);
  }

  function handleReject() {
    setStatus('rejected');
    onStatusChange(msg.id, 'rejected');
  }

  const isClosed = status === 'rejected';

  return (
    <>
      <Confetti active={showConfetti} onDone={() => setShowConfetti(false)} />

      {/* 딤 배경 */}
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* 채팅창 */}
      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center">
        <div
          className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col w-full md:max-w-md md:mx-4"
          style={{ height: '80dvh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 드래그 핸들 (모바일) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200 md:hidden" />

          {/* 헤더 */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-sky-50 shrink-0">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-sky-300 to-indigo-300 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {counterpart.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm truncate">{msg.teamName}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${className}`}>
                  {label}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{counterpart.name}{counterpart.role ? ` · ${counterpart.role}` : ''}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 말풍선 영역 */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-sky-50/30">
            {bubbles.map((bubble, i) => {
              const isMe = bubble.fromUserId === currentUserId;
              const prevBubble = bubbles[i - 1];
              const showDateLabel = !prevBubble || !isSameDay(prevBubble.time, bubble.time);
              return (
                <div key={bubble.id}>
                  {showDateLabel && (
                    <div className="flex items-center justify-center my-2">
                      <span className="text-[11px] text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                        {formatDateLabel(bubble.time)}
                      </span>
                    </div>
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[75%] px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? 'bg-sky-500 text-white rounded-2xl rounded-tr-sm'
                          : 'bg-white border border-sky-100 text-gray-800 rounded-2xl rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {bubble.text}
                    </div>
                    <span className="text-[10px] text-gray-300 mt-1 px-1">{formatTime(bubble.time)}</span>
                  </div>
                </div>
              );
            })}

            {/* 상태 시스템 안내 */}
            <SystemNotice status={status} contactUrl={msg.contactUrl} />

            <div ref={bottomRef} />
          </div>

          {/* 하단 영역 */}
          <div className="shrink-0 border-t border-sky-50 bg-white px-4 py-3">
            {isInbox && status === 'pending' && (
              <div className="flex gap-2 mb-3">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 text-white text-sm font-semibold transition-all"
                >
                  수락
                </button>
                <button
                  onClick={handleReject}
                  className="flex-1 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 text-gray-500 text-sm font-semibold transition-all"
                >
                  거절
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isClosed ? '종료된 대화입니다.' : '메시지를 입력하세요...'}
                disabled={isClosed}
                className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:border-sky-300 bg-sky-50 placeholder:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isClosed}
                className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
