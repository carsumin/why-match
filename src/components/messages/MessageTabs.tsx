'use client';

// 메시지함 탭 UI (받은 메시지 / 보낸 메시지)

import { useState } from 'react';
import type { MessageDisplay } from '@/data/messages';
import ChatModal from './ChatModal';
import { useMessageContext } from '@/context/MessageContext';
import * as teamDb from '@/lib/teamDb';
import * as messageDb from '@/lib/messageDb';
import { getUserById } from '@/data/teams';

const STATUS_CONFIG = {
  pending: { label: '대기 중', className: 'bg-yellow-50 text-yellow-600 border border-yellow-200' },
  accepted: { label: '수락됨', className: 'bg-green-50 text-green-700 border border-green-200' },
  rejected: { label: '거절됨', className: 'bg-red-50 text-red-500 border border-red-200' },
} as const;

const ROLE_COLOR: Record<string, string> = {
  Frontend: 'bg-[#dde4f5] text-sky-700',
  Backend: 'bg-indigo-100 text-indigo-700',
  Designer: 'bg-pink-100 text-pink-700',
  PM: 'bg-purple-100 text-purple-700',
  'ML Engineer': 'bg-amber-100 text-amber-700',
};

function getRoleColor(role: string) {
  return ROLE_COLOR[role] ?? 'bg-gray-100 text-gray-600';
}

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}시간 전`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

interface MessageCardProps {
  msg: MessageDisplay;
  isInbox: boolean;
  onClick: () => void;
}

function MessageCard({ msg, isInbox, onClick }: MessageCardProps) {
  const { label, className } = STATUS_CONFIG[msg.status];
  // 받은 메시지: 미읽음 / 보낸 메시지: 수락·거절 결과 미확인
  const isUnread = isInbox ? !msg.isRead : (msg.status !== 'pending' && !msg.isRead);

  // 보낸 메시지: 상대방 = 팀장, 받은 메시지: 상대방 = 지원자
  const counterpart = isInbox
    ? { name: msg.fromUserName, role: msg.fromUserRole }
    : (() => {
        const team = teamDb.getTeams().find((t) => t.teamCode === msg.teamCode);
        const leader = team ? getUserById(team.leaderId) : null;
        return { name: leader?.name ?? msg.teamName, role: leader?.roles[0] ?? '' };
      })();

  // 최신 버블이 있으면 그걸 미리보기로, 없으면 원본 메시지
  const latestBubble = messageDb.getLatestBubble(msg.id);
  const previewText = latestBubble?.text ?? msg.message;
  const previewDate = latestBubble?.createdAt ?? msg.createdAt;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all ${
        isUnread
          ? 'border-sky-300 bg-[#eef1fb] hover:border-sky-400 hover:shadow-sm'
          : 'border-[#dde4f5] bg-white/70 backdrop-blur hover:border-sky-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* 아바타 + 안읽음 점 */}
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-sky-300 to-indigo-300 flex items-center justify-center text-white text-sm font-bold">
            {counterpart.name[0]}
          </div>
          {isUnread && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-400 border-2 border-white" />
          )}
        </div>

        {/* 본문 */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
            <span className={`text-sm ${isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
              {counterpart.name}
            </span>
            {counterpart.role && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(counterpart.role)}`}>
                {counterpart.role}
              </span>
            )}
            <span className="text-xs text-gray-400">→</span>
            <span className="text-xs font-medium text-gray-600">{msg.teamName}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ml-auto ${className}`}>
              {label}
            </span>
          </div>
          <p className={`text-sm line-clamp-1 mb-1 ${isUnread ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
            {previewText}
          </p>
          <span className="text-xs text-gray-300">{formatDate(previewDate)}</span>
        </div>
      </div>
    </button>
  );
}

export default function MessageTabs() {
  const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
  const [selectedMsg, setSelectedMsg] = useState<MessageDisplay | null>(null);
  const { inbox, sent, unreadCount, updateStatus, markAsRead } = useMessageContext();
  const messages = activeTab === 'inbox' ? inbox : sent;
  const sentNewCount = sent.filter((m) => m.status !== 'pending' && !m.isRead).length;

  function handleOpen(msg: MessageDisplay) {
    setSelectedMsg(msg);
    if (!msg.isRead) markAsRead(msg.id);
  }

  function handleStatusChange(id: string, status: 'accepted' | 'rejected') {
    updateStatus(id, status);
    setSelectedMsg((prev) => (prev?.id === id ? { ...prev, status } : prev));
  }

  return (
    <div>
      {/* 탭 버튼 */}
      <div className="flex gap-1 mb-6 p-1 bg-[#eef1fb] rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'inbox'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          받은 메시지
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 text-white text-[10px] flex items-center justify-center font-bold">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`relative px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === 'sent'
              ? 'bg-white text-sky-700 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          보낸 메시지
          {sentNewCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-400 text-white text-[10px] flex items-center justify-center font-bold">
              {sentNewCount}
            </span>
          )}
        </button>
      </div>

      {/* 메시지 목록 */}
      {messages.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">메시지가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              isInbox={activeTab === 'inbox'}
              onClick={() => handleOpen(msg)}
            />
          ))}
        </div>
      )}

      {/* 채팅 모달 */}
      {selectedMsg && (
        <ChatModal
          msg={selectedMsg}
          isInbox={activeTab === 'inbox'}
          onClose={() => setSelectedMsg(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
