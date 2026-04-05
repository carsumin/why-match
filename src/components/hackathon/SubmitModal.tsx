'use client';

// 해커톤 제출 확인 → 완료 모달

import { useEffect, useState } from 'react';

interface SubmitItem {
  key: string;
  title: string;
  format: string;
  value: string;
}

interface SubmitModalProps {
  hackathonTitle: string;
  items: SubmitItem[];
  onClose: () => void;
}

// 박수 파티클 — 방향벡터(px)·회전(deg)·크기·딜레이
const CLAP_PARTICLES = [
  { tx: -160, ty: -260, r: -20, size: 28, delay: 0   },
  { tx:    0, ty: -300, r:   5, size: 32, delay: 40  },
  { tx:  160, ty: -260, r:  18, size: 26, delay: 20  },
  { tx: -240, ty: -140, r: -30, size: 24, delay: 60  },
  { tx:  240, ty: -140, r:  25, size: 30, delay: 80  },
  { tx:  -90, ty: -320, r: -10, size: 22, delay: 30  },
  { tx:   90, ty: -320, r:  12, size: 26, delay: 50  },
  { tx: -200, ty:  -60, r: -40, size: 20, delay: 70  },
  { tx:  200, ty:  -60, r:  35, size: 20, delay: 90  },
  { tx:    0, ty: -200, r:  -5, size: 36, delay: 10  },
];

export default function SubmitModal({ hackathonTitle, items, onClose }: SubmitModalProps) {
  const [step, setStep] = useState<'confirm' | 'done'>('confirm');
  const [clapActive, setClapActive] = useState(false);
  const [submittedAt] = useState(() =>
    new Date().toLocaleString('ko-KR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && step === 'confirm') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, step]);

  function handleConfirm() {
    setClapActive(true);
    setTimeout(() => setStep('done'), 320);
    setTimeout(() => setClapActive(false), 1100);
  }

  return (
    <>
      <style>{`
        @keyframes clap-burst {
          0%   { transform: translate(-50%, -50%) translate(0px, 0px) scale(0.2); opacity: 0; }
          18%  { opacity: 1; }
          70%  { opacity: 1; }
          100% { transform: translate(-50%, -50%) translate(var(--tx), var(--ty)) scale(0.1) rotate(var(--r)); opacity: 0; }
        }
        @keyframes done-pop {
          0%   { transform: scale(0.7); opacity: 0; }
          65%  { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes icon-bounce {
          0%, 100% { transform: scale(1); }
          40%      { transform: scale(1.22) rotate(-6deg); }
          70%      { transform: scale(0.94) rotate(4deg); }
        }
      `}</style>

      {/* 박수 파티클 레이어 */}
      {clapActive && (
        <div className="fixed inset-0 z-[70] pointer-events-none overflow-hidden">
          {CLAP_PARTICLES.map((p, i) => (
            <span
              key={i}
              style={{
                position: 'fixed',
                left: '50%',
                top: '55%',
                fontSize: p.size,
                '--tx': `${p.tx}px`,
                '--ty': `${p.ty}px`,
                '--r': `${p.r}deg`,
                animation: `clap-burst 900ms cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}ms both`,
                lineHeight: 1,
                userSelect: 'none',
              } as React.CSSProperties}
            >
              👏
            </span>
          ))}
        </div>
      )}

      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={step === 'confirm' ? onClose : undefined}
      />

      <div className="fixed inset-x-0 bottom-0 z-50 md:inset-0 md:flex md:items-center md:justify-center">
        <div
          className="relative bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col w-full md:max-w-md md:mx-4"
          style={{ maxHeight: '80dvh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {step === 'confirm' && (
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
          )}

          {step === 'confirm' ? (
            <>
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-base font-bold text-gray-900">제출 확인</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
                  aria-label="닫기"
                >
                  ✕
                </button>
              </div>

              <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">
                <p className="text-sm text-gray-600">
                  아래 내용으로 최종 제출합니다. 제출 후에는 수정이 불가합니다.
                </p>

                <div className="rounded-xl bg-sky-50 p-4 space-y-3">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">제출 대상</p>
                  <p className="text-sm font-bold text-gray-900">{hackathonTitle}</p>

                  {items.length > 0 && (
                    <div className="pt-2 border-t border-sky-100 space-y-2">
                      {items.map((item) => (
                        <div key={item.key}>
                          <p className="text-xs text-gray-400">{item.title}</p>
                          <p className="text-sm text-gray-700 truncate font-medium">
                            {item.value || <span className="text-gray-400 font-normal">(미입력)</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  제출 후에도 마감 전까지는 재제출이 가능합니다. 최신 제출 기준으로 평가됩니다.
                </p>
              </div>

              <div className="px-5 pb-6 pt-3 flex gap-3 border-t border-gray-100">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
                >
                  최종 제출
                </button>
              </div>
            </>
          ) : (
            /* 완료 화면 */
            <div
              className="flex flex-col items-center justify-center px-5 py-12 text-center gap-4"
              style={{ animation: 'done-pop 400ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
            >
              <div
                className="w-20 h-20 rounded-full bg-sky-50 flex items-center justify-center text-4xl select-none"
                style={{ animation: 'icon-bounce 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 300ms both' }}
              >
                👏
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 mb-1">제출 완료!</p>
                <p className="text-sm text-gray-400">{submittedAt}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                결과 및 순위는 마감 후<br />리더보드에서 확인하실 수 있습니다.
              </p>
              <button
                onClick={onClose}
                className="mt-2 w-full py-3 rounded-xl bg-sky-200 text-sky-800 text-sm font-bold hover:bg-sky-300 transition-colors"
              >
                확인
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
