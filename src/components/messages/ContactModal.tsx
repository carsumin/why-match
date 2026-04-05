'use client';

// 팀 연락하기 모달 — 팀카드에서 처음 메시지를 보내는 UI

import { useEffect, useRef, useState } from 'react';
import { useMessageContext } from '@/context/MessageContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { TeamRecord } from '@/lib/teamDb';

interface Props {
  team: TeamRecord;
  onClose: () => void;
}

export default function ContactModal({ team, onClose }: Props) {
  const { currentUser } = useCurrentUser();
  const { sendMessage } = useMessageContext();
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 열릴 때 스크롤 막기 + 포커스
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    textareaRef.current?.focus();
    return () => { document.body.style.overflow = ''; };
  }, []);

  // ESC 닫기
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleSend() {
    if (!text.trim() || !currentUser) return;
    sendMessage({
      teamCode: team.teamCode,
      teamName: team.name,
      hackathonSlug: team.hackathonSlug,
      message: text.trim(),
      currentUser,
    });
    setSent(true);
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center">
        <div
          className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col w-full md:max-w-md md:mx-4"
          style={{ maxHeight: '80dvh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 드래그 핸들 (모바일) */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-gray-200 md:hidden" />

          {/* 헤더 */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-sky-50 shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-300 to-sky-300 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {team.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-gray-900 text-sm truncate block">{team.name}</span>
              <p className="text-xs text-gray-400">팀에게 메시지 보내기</p>
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

          {/* 본문 */}
          <div className="flex-1 px-4 py-5 overflow-y-auto">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
                <span className="text-4xl">📨</span>
                <p className="font-semibold text-gray-800">메시지를 보냈습니다!</p>
                <p className="text-sm text-gray-400">메시지함에서 답변을 확인할 수 있어요.</p>
                <button
                  onClick={onClose}
                  className="mt-2 px-5 py-2 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
                >
                  닫기
                </button>
              </div>
            ) : (
              <>
                {/* 모집 포지션 안내 */}
                {team.lookingFor.length > 0 && (
                  <div className="mb-4 p-3 rounded-xl bg-sky-50 border border-sky-100">
                    <p className="text-xs text-gray-400 mb-1.5">이 팀이 찾는 포지션</p>
                    <div className="flex flex-wrap gap-1.5">
                      {team.lookingFor.map((pos) => (
                        <span key={pos} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white border border-sky-100 text-gray-600">
                          {pos}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <label className="text-xs font-semibold text-gray-500 block mb-1.5">
                  지원 메시지 <span className="text-red-400">*</span>
                </label>
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`${team.name}에게 자기소개와 합류 이유를 전달해보세요.`}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-sky-100 text-sm focus:outline-none focus:border-sky-300 bg-sky-50 placeholder:text-gray-300 resize-none"
                />
                {!currentUser && (
                  <p className="mt-2 text-xs text-red-400">로그인 후 메시지를 보낼 수 있습니다.</p>
                )}
              </>
            )}
          </div>

          {/* 전송 버튼 */}
          {!sent && (
            <div className="shrink-0 border-t border-sky-50 bg-white px-4 py-3">
              <button
                onClick={handleSend}
                disabled={!text.trim() || !currentUser}
                className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-600 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition-all"
              >
                보내기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
