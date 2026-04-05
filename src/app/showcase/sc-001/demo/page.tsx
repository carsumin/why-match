'use client';

// MediAI 데모 페이지

import { useState } from 'react';
import Link from 'next/link';

const MOCK_RESULTS: Record<string, { diagnosis: string; description: string; hospitals: { name: string; dist: string; dept: string }[] }> = {
  default: {
    diagnosis: '상기도 감염 (감기) 의심',
    description: '입력하신 증상은 일반적인 감기 증상과 유사합니다. 충분한 수분 섭취와 휴식을 권장합니다. 증상이 3일 이상 지속되거나 고열(38.5°C 이상)이 발생하면 진료를 받으시기 바랍니다.',
    hospitals: [
      { name: '서울내과의원', dist: '0.4km', dept: '내과' },
      { name: '한강이비인후과', dist: '0.7km', dept: '이비인후과' },
      { name: '강남성심병원 응급', dist: '1.2km', dept: '응급의학과' },
    ],
  },
};

const SYMPTOM_SUGGESTIONS = ['두통', '발열', '기침', '콧물', '인후통', '복통', '구역질', '어지러움'];

export default function MediAIDemoPage() {
  const [input, setInput] = useState('');
  const [chips, setChips] = useState<string[]>([]);
  const [result, setResult] = useState<typeof MOCK_RESULTS['default'] | null>(null);
  const [loading, setLoading] = useState(false);

  function addChip(s: string) {
    if (!chips.includes(s)) setChips((prev) => [...prev, s]);
  }

  function removeChip(s: string) {
    setChips((prev) => prev.filter((c) => c !== s));
  }

  function handleAnalyze() {
    if (!chips.length && !input.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult(MOCK_RESULTS.default);
    }, 1600);
  }

  return (
    <div className="min-h-screen bg-sky-50">
      {/* 상단 바 */}
      <header className="bg-white border-b border-sky-100 px-4 py-3 flex items-center gap-3">
        <Link href="/showcase" className="text-gray-400 hover:text-gray-700 text-sm">← 쇼케이스</Link>
        <span className="text-gray-300">|</span>
        <span className="text-sm font-bold text-gray-900">MediAI <span className="text-xs font-normal text-gray-400 ml-1">데모</span></span>
      </header>

      <div className="max-w-lg mx-auto px-4 py-8 space-y-5">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-sky-100 flex items-center justify-center text-2xl mx-auto mb-3">🏥</div>
          <h1 className="text-xl font-extrabold text-gray-900">증상을 알려주세요</h1>
          <p className="text-sm text-gray-500 mt-1">AI가 예상 진단과 가까운 병원을 추천해 드립니다.</p>
        </div>

        {/* 증상 칩 */}
        <div className="bg-white rounded-2xl border border-sky-100 p-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400">빠른 선택</p>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => addChip(s)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  chips.includes(s)
                    ? 'bg-sky-200 border-sky-300 text-sky-800 font-semibold'
                    : 'border-sky-100 text-gray-600 hover:bg-sky-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {chips.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {chips.map((c) => (
                <span key={c} className="flex items-center gap-1 text-xs bg-sky-100 text-sky-800 px-2.5 py-1 rounded-full font-semibold">
                  {c}
                  <button onClick={() => removeChip(c)} className="text-sky-500 hover:text-sky-800">×</button>
                </span>
              ))}
            </div>
          )}

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="증상을 직접 입력하세요 (예: 어제부터 목이 아프고 미열이 있어요)"
            rows={3}
            className="w-full text-sm px-3 py-2.5 rounded-xl border border-sky-100 focus:outline-none focus:border-sky-300 resize-none"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || (!chips.length && !input.trim())}
          className="w-full py-3.5 rounded-2xl bg-sky-400 text-white font-bold text-sm hover:bg-sky-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'AI 분석 중…' : 'AI 상담 시작'}
        </button>

        {/* 분석 결과 */}
        {loading && (
          <div className="bg-white rounded-2xl border border-sky-100 p-6 text-center space-y-3">
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 rounded-full bg-sky-300 inline-block"
                  style={{ animation: `bounce 0.8s ${i * 0.15}s infinite alternate` }}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">증상을 분석하고 있습니다…</p>
            <style>{`@keyframes bounce { from { transform: translateY(0); } to { transform: translateY(-8px); } }`}</style>
          </div>
        )}

        {result && !loading && (
          <div className="space-y-3">
            {/* 진단 */}
            <div className="bg-white rounded-2xl border border-sky-100 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🩺</span>
                <p className="text-xs font-semibold text-gray-400">AI 예상 진단</p>
              </div>
              <p className="text-base font-bold text-gray-900">{result.diagnosis}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
            </div>

            {/* 추천 병원 */}
            <div className="bg-white rounded-2xl border border-sky-100 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">📍</span>
                <p className="text-xs font-semibold text-gray-400">근처 추천 병원</p>
              </div>
              {result.hospitals.map((h) => (
                <div key={h.name} className="flex items-center justify-between py-2 border-b border-sky-50 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{h.name}</p>
                    <p className="text-xs text-gray-400">{h.dept}</p>
                  </div>
                  <span className="text-xs font-semibold text-sky-600">{h.dist}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-gray-400 px-4">
              ⚠️ 이 결과는 AI 시뮬레이션입니다. 실제 진료를 대체하지 않습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
