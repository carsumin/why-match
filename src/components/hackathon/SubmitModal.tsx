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
  onSubmitted: (submittedAt: string) => void;
}

// 박수 파티클 — 방향(px)·최종 회전(deg)·크기(px)·출발 딜레이(ms)
const CLAP_PARTICLES: { tx: number; ty: number; r: number; size: number; delay: number }[] = [
  // 정상단 클러스터
  { tx:   0,  ty: -320, r:   0, size: 40, delay:  0 },
  { tx: -40,  ty: -300, r: -12, size: 30, delay: 20 },
  { tx:  40,  ty: -300, r:  14, size: 28, delay: 35 },
  // 좌상
  { tx: -150, ty: -260, r: -28, size: 32, delay: 50 },
  { tx: -220, ty: -180, r: -42, size: 24, delay: 70 },
  { tx: -270, ty:  -80, r: -58, size: 20, delay: 90 },
  // 우상
  { tx:  155, ty: -255, r:  26, size: 34, delay: 45 },
  { tx:  225, ty: -170, r:  44, size: 22, delay: 65 },
  { tx:  275, ty:  -70, r:  60, size: 20, delay: 85 },
  // 사선 하단
  { tx: -190, ty:   70, r: -70, size: 18, delay: 100 },
  { tx:  195, ty:   75, r:  68, size: 18, delay:  95 },
  // 중간 보조
  { tx:  -80, ty: -210, r: -10, size: 26, delay: 15 },
  { tx:   85, ty: -205, r:   8, size: 24, delay: 25 },
];

export default function SubmitModal({ hackathonTitle, items, onClose, onSubmitted }: SubmitModalProps) {
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
    setTimeout(() => {
      setStep('done');
      onSubmitted(submittedAt);
    }, 340);
    setTimeout(() => setClapActive(false), 1200);
  }

  return (
    <>
      <style>{`
        /*
         * clap-fly:
         *  0%   → 중심에서 scale(0), 불투명도 0
         *  12%  → 빠르게 scale(1.8)로 spring pop, 이동 10%
         *  40%  → scale(1.1)로 안정, 이동 55%, 회전 반쯤
         *  75%  → 이동 88%, 불투명도 유지
         * 100%  → 목적지 도달, scale(0.2), 페이드 아웃
         */
        @keyframes clap-fly {
          0% {
            transform: translate(-50%, -50%) translate(0px, 0px) scale(0) rotate(0deg);
            opacity: 0;
          }
          12% {
            transform: translate(-50%, -50%)
              translate(calc(var(--tx) * 0.08px), calc(var(--ty) * 0.08px))
              scale(1.8)
              rotate(calc(var(--r) * 0.1deg));
            opacity: 1;
          }
          40% {
            transform: translate(-50%, -50%)
              translate(calc(var(--tx) * 0.55px), calc(var(--ty) * 0.55px))
              scale(1.1)
              rotate(calc(var(--r) * 0.5deg));
            opacity: 1;
          }
          75% {
            transform: translate(-50%, -50%)
              translate(calc(var(--tx) * 0.88px), calc(var(--ty) * 0.88px))
              scale(0.85)
              rotate(calc(var(--r) * 0.85deg));
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%)
              translate(calc(var(--tx) * 1px), calc(var(--ty) * 1px))
              scale(0.2)
              rotate(calc(var(--r) * 1deg));
            opacity: 0;
          }
        }

        /* 완료 카드 등장 */
        @keyframes done-pop {
          0%   { transform: scale(0.72) translateY(12px); opacity: 0; }
          60%  { transform: scale(1.04) translateY(-2px); opacity: 1; }
          100% { transform: scale(1) translateY(0);       opacity: 1; }
        }

        /* 완료 아이콘 — 두 번 튀는 박수 모션 */
        @keyframes icon-clap {
          0%   { transform: scale(0) rotate(-15deg); }
          35%  { transform: scale(1.35) rotate(8deg); }
          55%  { transform: scale(0.88) rotate(-5deg); }
          72%  { transform: scale(1.12) rotate(4deg); }
          88%  { transform: scale(0.96) rotate(-2deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
      `}</style>

      {/* 박수 파티클 레이어 */}
      {clapActive && (
        <div className="fixed inset-0 z-[70] pointer-events-none">
          {CLAP_PARTICLES.map((p, i) => (
            <span
              key={i}
              style={{
                position: 'fixed',
                left: '50%',
                top: '58%',
                fontSize: `${p.size}px`,
                lineHeight: 1,
                display: 'block',
                userSelect: 'none',
                willChange: 'transform, opacity',
                /* CSS custom properties — 정수값 전달, keyframe 안에서 px·deg 붙임 */
                ['--tx' as string]: p.tx,
                ['--ty' as string]: p.ty,
                ['--r'  as string]: p.r,
                animation: `clap-fly 950ms cubic-bezier(0.22, 1, 0.36, 1) ${p.delay}ms both`,
              }}
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

                <div className="rounded-xl bg-[#eef1fb] p-4 space-y-3">
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">제출 대상</p>
                  <p className="text-sm font-bold text-slate-900">{hackathonTitle}</p>

                  {items.length > 0 && (
                    <div className="pt-2 border-t border-[#dde4f5] space-y-2">
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
                  className="flex-1 py-3 rounded-xl bg-[#4f72c4] text-white text-sm font-bold hover:bg-[#3a5aa8] transition-colors"
                >
                  최종 제출
                </button>
              </div>
            </>
          ) : (
            /* 완료 화면 */
            <div
              className="flex flex-col items-center justify-center px-5 py-12 text-center gap-3"
              style={{ animation: 'done-pop 420ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
            >
              <div
                className="w-20 h-20 rounded-full bg-[#eef1fb] flex items-center justify-center text-4xl select-none"
                style={{ animation: 'icon-clap 700ms cubic-bezier(0.34, 1.56, 0.64, 1) 280ms both' }}
              >
                👏
              </div>
              <div className="mt-1">
                <p className="text-lg font-bold text-gray-900 mb-1">제출 완료!</p>
                <p className="text-sm text-gray-400">{submittedAt}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                결과 및 순위는 마감 후<br />리더보드에서 확인하실 수 있습니다.
              </p>
              <button
                onClick={onClose}
                className="mt-3 w-full py-3 rounded-xl bg-[#dde4f5] text-[#3a5aa8] text-sm font-bold hover:bg-[#c7d3ee] transition-colors"
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
