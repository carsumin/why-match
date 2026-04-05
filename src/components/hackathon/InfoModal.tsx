'use client';

// 규정 보기 / FAQ 모달

import { useEffect } from 'react';

type RulesContent = {
  sections: { title: string; items: string[] }[];
};

type FaqContent = {
  items: { q: string; a: string }[];
};

interface InfoModalProps {
  type: 'rules' | 'faq';
  rules: RulesContent;
  faq: FaqContent;
  onClose: () => void;
}

export default function InfoModal({ type, rules, faq, onClose }: InfoModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const title = type === 'rules' ? '📋 참가 규정' : '❓ FAQ';

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center">
        <div
          className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col w-full md:max-w-lg md:mx-4"
          style={{ maxHeight: '85dvh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* 드래그 핸들 (모바일) */}
          <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200" />
          </div>

          {/* 헤더 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              aria-label="닫기"
            >
              ✕
            </button>
          </div>

          {/* 본문 */}
          <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">
            {type === 'rules' && (
              <>
                {rules.sections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">{section.title}</h3>
                    <ul className="space-y-1.5">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex gap-2 text-sm text-gray-600">
                          <span className="text-gray-300 mt-0.5 shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            )}

            {type === 'faq' && (
              <div className="space-y-4">
                {faq.items.map((item, i) => (
                  <div key={i} className="rounded-xl bg-sky-50 p-4">
                    <p className="text-sm font-semibold text-gray-900 mb-1.5">Q. {item.q}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">A. {item.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
